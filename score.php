<?php

//kunci jawaban.
//enaknya sih dibikin dinamis, biar singkron dengan yang ada di questions.json ... tapi takutnya makan resource.. jadinya statis aja disini.

$kuncijawaban = [
	101 => 1,
	102 => 0,
	103 => 0,
	104 => 3,
	105 => 3,
	106 => 0,
	107 => 2,
	108 => 4,
	109 => 0,
	110 => 1
];

// ternyata dia ga bisa bedain post yang gak diisi (null) dengan array kunci jawaban yang tidak masuk kedalam soal (sama-sama null);
// jsdi agar kita tau berapa banyak soal yang dikerjakan oleh pengguna (biar bisa dinamis, ga statis aja hanya 10, misal.) harus ada verifikasi dengan js, misalnya
//    untuk form yang belum keiisi, suruh diisi. Atau bila tidak diisi, secara otomatis dikasih nilai "tidak diisi", misalnya.
?>

<?php

$benar = 0;
$nama;
$sertif;
$JUMlAH_SOAL = 10;

foreach( $_POST as $key => $value) { //iya terbukti, dari hasil ini, yang gak diisi di skip. Jadi kita gak tau berapa banyak soal yang dikerjakan oleh pengguna.
	if($key == "nama") {
		$nama = $value; //harus divalidasi..
	}else if($key == "idfb"){
		if(is_numeric($value)){ //validasi bahwa id fb harus selalu angka.
			$sertif = $value;
		}else {
			$sertif = "";
		}
			//$sertif = str_replace("\\","", str_replace("/", "", $value)); // (fix sementara) masih rawan injeksi..harus di validasi... karena mau write file bisa aja nanti dideface...
	}else{
		if( $value == $kuncijawaban[$key]) {
			$benar++;
		}
	}
	//echo $key."->".$value."<br/>";
}
$nilaiAkhir = $benar*100/$JUMlAH_SOAL;
$status = "test";
if($nilaiAkhir < 40) {
	$status = "ArcGIS Newbie";
	$k_status = "Kamu termasuk orang yang baru belajar tentang ArcGIS dan GIS secara umumnya. ".
	"Asah terus kemampuan kamu sehingga kamu bisa menjadi Master of ArcGIS!";
}else if($nilaiAkhir <70) {
	$status = "ArcGIS Intermediate";
	$k_status = "Kamu termasuk orang yang sudah cukup bisa mengoperasikan ArcGIS dan GIS secara umumnya. ".
	"Kamu juga sudah agak terbiasa mengoperasikan ArcGIS untuk proyek-proyek tertentu. ".
	"Namun, pemahaman dasar kamu masih butuh diperbaiki. ".
	"Terus perdalam pemahaman kamu sehingga bisa menjadi Master of ArcGIS!";
}else if($nilaiAkhir <90) {
	$status = "ArcGIS Expert";
	$k_status = "Kamu sudah bisa mengoperasikan ArcGIS dengan sangat efisien! ".
	"ArcGIS merupakan makanan sehari-hari dalam pekerjaan mu! ".
	"Namun, terus perdalam pemahaman kamu sehingga bisa menjadi Master of ArcGIS! ".
	"Gelar Master of ArcGIS sudah di depan mata!";
}else if($nilaiAkhir <=100) {
	$status = "Master of ArcGIS";
	$k_status = "Kamu. adalah. master. of. ArcGIS!";
}

//echo "nama: ".$nama."<br />id: ".$sertif."<br />nilai: ".$nilaiAkhir."<br />telah menjadi: ".$status." of ArcGIS<br />";

?>

<?php //bagian membuat sertifikat image.
if($nama != "" && $sertif != "") {
	$im = imagecreatefrompng("img/template.png");
	$black = imagecolorallocate($im, 0, 0, 0);
	$text = 'Testing...';
	$font = 'fonts/Raleway-Light.ttf';
	$fontbold = 'fonts/Raleway-Bold.ttf';
	$fontitalic = 'fonts/Raleway-LightItalic.ttf';
	//371 titik tengah
	imagettftext($im, 12, 0, 220, 130, $black, $font, "Menyatakan bahwa");
	imagettftext($im, 16, 0, 220, 162, $black, $fontbold, $nama); //24
	imagettftext($im, 11, 0, 220, 192, $black, $font, "telah menjadi");
	imagettftext($im, 22, 0, 220, 229, $black, $font, $status);
	imagettftext($im, 11, 0, 220, 260, $black, $font, "dengan perolehan nilai ".$nilaiAkhir."%");
	imagettftext($im, 11, 0, 220, 280, $black, $font, "dalam tes Master of ArcGIS");
	imagettftext($im, 11, 0, 220, 300, $black, $fontitalic, "http://charted.esy.es/");

	// Using imagepng() results in clearer text compared with imagejpeg()

	$PREFIXFOLDER = "tmp";

	$tanggal = getdate()["mday"];

	$namadir = $PREFIXFOLDER.$tanggal;
	if(!file_exists($namadir)) {
		mkdir($namadir);
		//echo "Created new folder<br />";
	}
	//hapus semua folder tmp lusa.. nanti cari caranya..
	//for($i=1;$i<=($tanggal-2);$i++) { //jika tanggal = 1, maka delete semua tanggal lebih besar..
	//	
	//}
	$fileimg = $namadir."/".$sertif.".png";
	//echo "file gambar disimpan di: ".$fileimg."<br />";
	imagepng($im, $fileimg); //harusnya nanti berupa tanggal dan jam
	imagedestroy($im);
}
?>
<?php // hasil akhir dari file ini harusnya me return json tentang lokasi file share dan file sertifikat, sekaligus nama dan nilai.
	if($nama != "" && $sertif != "") {
		//echo '{"nama":"'.$nama.'", "id":"'.$sertif.'", "nilai":"'.$nilaiAkhir.'", "status":"'.$status.'", "share_url":"'.$fileshare.'", "share_img":"'.$fileimg.'" }';
	}
	echo '{"nama":"'.$nama.'", "id":"'.$sertif.'", "nilai":"'.$nilaiAkhir.'", "status":"'.$status.'", "keterangan_status": "'.$k_status.'","share_url":"'.$fileshare.'", "share_img":"'.$fileimg.'", "pesan_response":"", "kode_respons":"" }';
?>

