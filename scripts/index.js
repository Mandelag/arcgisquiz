/** This is called with the results from from FB.getLoginStatus(). **/
			function statusChangeCallback(response) {
				console.log('statusChangeCallback');
				//console.log(response);
				// The response object is returned with a status field that lets the
				// app know the current login status of the person.
				// Full docs on the response object can be found in the documentation
				// for FB.getLoginStatus().
				if (response.status === 'connected') {
					// Logged into your app and Facebook.
					$("#loginbutton").hide();
					testAPI();
				} else if (response.status === 'not_authorized') {
					// The person is logged into Facebook, but not your app.
					toggleLogin();
				} else {
					// The person is not logged into Facebook, so we're not sure if
					// they are logged into this app or not.
					toggleLogin();
				}
			}
			
			/** This function is called when someone finishes with the Login
			 * Button.  See the onlogin handler attached to it in the sample
			 * code below.
			 **/
			function checkLoginState() {
				FB.getLoginStatus(function(response) {
					statusChangeCallback(response);
				});
			}

			window.fbAsyncInit = function() {
				FB.init({
				  appId      : '1713339518906927',
				  xfbml      : true,
				  version    : 'v2.6'
				});
				FB.getLoginStatus(function(response) {
					statusChangeCallback(response);
				});
			};

			(function(d, s, id){
				 var js, fjs = d.getElementsByTagName(s)[0];
				 if (d.getElementById(id)) {return;}
				 js = d.createElement(s); js.id = id;
				 js.src = "//connect.facebook.net/en_US/sdk.js";
				 fjs.parentNode.insertBefore(js, fjs);
			   }(document, 'script', 'facebook-jssdk'));
			   
			function testAPI() {
				//console.log('Welcome!  Fetching your information.... ');
				
				FB.api('/me', function(response) {
					console.log(response);
					//console.log('Successful login for: ' + response.name + ' (' +response.id+ ')');
					//document.getElementById('status').innerHTML ='Thanks for logging in, ' + response.name + '!';
					toggleLogout(response);
				});
			}
			
			function toggleLogin() {
				$("#start").prop("disabled",true);
				$("#loginbutton").show();
				$("#greetings").text("Silahkan login dengan facebook untuk memulai.");
				$("#nama").val("");
				$("#idfb").val("");
			}
			
			function toggleLogout(response) {
				$("#namafb").val(response.name);
				$("#idfb").val(response.id);
				$("#start").prop("disabled",false);
				$("#loginbutton").hide();
				$("#greetings").text("Bermain sebagai " + response.name + " (");
				$("#greetings").append($("<a onclick=\"FB.logout(function (response){toggleLogin();})\" href=\"#\"></a>").text("logout"));
				$("#greetings").append(")");
				$("#greetings").show();
			}

			//PR masih masalah kalau misalnya di double click.
			var cardDisplay;
			var shareData;
						
			$(document).ready( function() {
				displayCard(0);
				
				$("#kembali").click(function(){
					console.log("bye");
				window.location.assign("http://charted.esy.es");
				});
				/** load questions using jQuery**/ //nanti diubah agar ini di load ke array dulu, pas document ready, baru dimasukan ke html
				$.getJSON("scripts/questions.json", null, function(data, textStatus, jqXHR) {
				console.log(data);
				for(var i=0;i<data.length;i++) {
					var newCard = generateCard(data[i],"Pertanyaan "+(i+1));
					var nextString = "displayCard("+(i+1+1)+")";
					var prevString = "displayCard("+(i)+")";
					$(newCard).find('.card-next-button').click(function(){
						displayCard(cardDisplay+1);
					});
					$(newCard).find('.card-prev-button').click(function(){
						displayCard(cardDisplay-1);
					});
					
					if(i==data.length-1){
						$(newCard).find('.card-next-button').prop("value","Done!");
						$(newCard).find('.card-next-button').unbind();
						$(newCard).find('.card-next-button').click(function (){
							hitungNilai();
						});
						/**
						$(newCard).find('.card-next-button').prop("value","Done!");
						$(newCard).find('.card-next-button').prop("type","submit");
						**/
					}
					if(i==0){$(newCard).find('.card-prev-button').hide();}	
					$("#kuis").append(newCard);
					}
				});
				
				
				$("#about").click(function() {
					alert("Master of ArcGIS\noleh\n\nMAKNYOS Studio.\n\nemail:\nmaknyos.studio@gmail.com\n\n"+
					"Ikon halaman, Ikon aplikasi, software ArcGIS, software ArcMap, dan template sertifikat merupakan milik ESRI.");
				});
				$(".fb-share-button").unbind();
			});

			
			/**
			 * Fungsi ini dijalankan ketika tombol start dijalankan.
			 */
			function start() {
				displayCard(2);
			}
			
			/**
			 * Fungsi ini dijalankan setelah semua form diisi, pada tombol di kartu soal terakhir.
			 */
			function hitungNilai() {
				//console.log("sedang menghitung");
				$.post("score.php", $("#kuis").serialize(), function (data) {	
					var responseobj = JSON.parse(data);
					console.log(responseobj);
					if(responseobj.nama == "" || responseobj.id == "") { return; };
					displayCard($(".card").length-1);
					$("#score-display").html(responseobj.nilai+"<span style=\"font-size:16px;\">"+"%"+"</span>");
					if(responseobj.share_img != ""){
						$("#img_share").show();
						$("#img_share").attr("src", ('http://charted.esy.es/'+responseobj.share_img+"?u="+Math.random()));
					}else {
						$("#img_share").hide();
					}
					$("#keterangan").html(responseobj.keterangan_status);
					$("#shareBtn").click(function(e) {
						FB.ui({
							method: 'feed',
							name: responseobj.nama + " merupakan " + responseobj.status,
							link: 'http://charted.esy.es/',
							picture: 'http://charted.esy.es/'+responseobj.share_img+"?u="+Math.random(), //solution thanks to http://stackoverflow.com/questions/20057510/clear-facebook-post-to-feed-image-cached
							caption: "charted.esy.es",
							description: "Mainkan aplikasinya dan buktikan bahwa dirimu merupakan Master of ArcGIS sekarang!",
						});
					});	
				});
			}
			/**
			 * Menangani perpindahan kartu.
			 */
			function displayCard(i) {	
				console.log("display card " + i);
				cardDisplay = i;
				$(".card").each(function(index, element) {
					if( index != i) {
						//$(element).css("background-color","white");
						$(element).fadeOut(200);
					}
				});
				setTimeout(function() {
				$(".card").each(function(index, element) {
					if(index == i) {
						//$(element).css("background-color","#feffcc");
						$(element).fadeIn(200);
					}
				});}, 200);	
			};

			function generateCard(questionSet, title="") {
				var div = $("<div id=\""+questionSet.questionId+"\"class=\"card\"></div>");
				var title = $("<p class=\"card-title\"></p>").text(title);;
				div.append(title);
				
				/** question image (if any)**/
				if(!(questionSet.image === undefined || questionSet.image == null || questionSet.image == "")) {
					var img = $("<img src=\""+questionSet.image+"\" class=\"card-image\"/>");
					div.append(img);
				}

				/** generating question text and its attribute**/
				var soal = $("<p class=\"question-text\"></p>").text(questionSet.question);
				div.append(soal);
				
				/** dynamically display list of question's choices **/
				var choicesCollection = [];
				for(var i=0; i<questionSet.choices.length; i++) {
					var textChoice = $("<p class=\"choice-text\"></p>");
					var d = $("<div></div");
					var radio = $("<input type=\"radio\" name=\""+questionSet.questionId+"\" value=\""+i+"\">");
					
					textChoice.append(radio);
					textChoice.append(questionSet.choices[i]);
					choicesCollection[i] = textChoice;
				}
				var acak_choicesCollection = shuffle(choicesCollection);
				for(var x in acak_choicesCollection) {
					div.append(acak_choicesCollection[x]);
				}
				//var ad = $("<scrip"+"t></s"+"cript>");//document.createElement("script");
				//ad.prop("type", "text/javascript");
				//ad.prop("src", "//pagead2.googlesyndication.com/pagead/show_ads.js");
				//ad.type = "text/javascript";
				//ad.src = "//pagead2.googlesyndication.com/pagead/show_ads.js"
				//div.append(ad);
				
				var nextButton = $("<input type=\"button\" value=\"Next >\" class=\"card-next-button\"/>");		
				var prevButton = $("<input type=\"button\" value=\"< Prev\" class=\"card-prev-button\"/>");

				div.append($("<br />"));
				div.append(nextButton);
				div.append(prevButton);
				return div;
			}
			/**
			 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
			 * credit: CoolAJ86
			 * https://bost.ocks.org/mike/shuffle/
			 **/
			function shuffle(array) {
			  var currentIndex = array.length, temporaryValue, randomIndex;
			  // While there remain elements to shuffle...
			  while (0 !== currentIndex) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			  }
			  return array;
			}
			
		
