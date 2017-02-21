//使用方法：设一个元素id为share，点击该元素将提示分享
var share = (function() {
	$(function() {
		init();
	});

	function init() {
		var content = '<div id="share_arrow" style="z-index:10;position: absolute;right: 0;top: 0;display:none;">';
		content += '<img width="200px" src="../img/share.png">';
		content += '</div>';
		content += '<div id="myBlocker" style="top: 0px; right: 0px; bottom: 0px; left: 0px; width: 100%; height: 100%; position: fixed; z-index: 7; background: none repeat scroll 0% 0% rgb(0, 0, 0); opacity: 0.75 !important;display:none;"></div>';
		$("body").append(content);

		$('#myBlocker,#share_arrow').on('click',function() {
			$('#myBlocker').hide();
			$('#share_arrow').hide();
		});

		$('#share').on('click',function() {
			$("html,body").stop(true);
			$("html,body").animate({scrollTop: "0px"}, 1000);
				 
			$('#myBlocker').show();
			$('#share_arrow').show();
		});

		var local = encodeURIComponent(location.href.split('#')[0]);
		// var appId = 'wx78f616156442e054';
		// 和教授wx60d937f36859b65d
		var appId = 'wx60d937f36859b65d';
		var nonceStr = "123456";
		var timestamp = new Date().getTime();

		var url = "/weixin/bind/getJsSignature_?noncestr=" + nonceStr
				+ "&timestamp=" + timestamp + "&url=" + local;
		// debug.log(url);

		$.get(url, function(signature) {
			config(signature);
		});

		function config(signature) {
			wx.config({
				debug : false,
				appId : appId,
				timestamp : timestamp,
				nonceStr : nonceStr,
				signature : signature,
				jsApiList : [ 'checkJsApi', 'onMenuShareTimeline',
						'onMenuShareAppMessage', 'onMenuShareQQ',
						'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems',
						'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
						'translateVoice', 'startRecord', 'stopRecord',
						'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice',
						'uploadVoice', 'downloadVoice', 'chooseImage',
						'previewImage', 'uploadImage', 'downloadImage',
						'getNetworkType', 'openLocation', 'getLocation',
						'hideOptionMenu', 'showOptionMenu', 'closeWindow',
						'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
						'addCard', 'chooseCard', 'openCard' ]
			});
		}
		
	}
	
	
	var shareObject = {};
	
	wx.ready(function() {
		wx.onMenuShareTimeline(shareObject);
		wx.onMenuShareAppMessage(shareObject);
	});
	
	var f = {};

	f.register = function(title, desc, link, imgUrl,callback) {
		shareObject.title = title;
		shareObject.desc = desc;
		shareObject.link = link;
		shareObject.imgUrl = imgUrl;
		shareObject.success = callback;
	};
	
	f.hide = function(){
		$('#myBlocker').hide();
		$('#share_arrow').hide();
	}

	return f;

})();
