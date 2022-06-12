var $recoms = $('#imageTypeLabel1');
var $recomsContainer = $('.auto-img');
$recomsContainer.hide();
$recoms.click(function() {
	if ($recoms.is(':checked')) {
		$recomsContainer.slideDown();
	}
});
// if ($custom.is(':checked')) {
// 	alert('custom checked');
// 	$recomsContainer.slideUp();
// 	$customContainer.slideDown();
// } else if ($recoms.is(':checked')) {
// 	alert('recoms checked');
// 	$recomsContainer.slideDown();
// 	$customContainer.slideUp();
// }
