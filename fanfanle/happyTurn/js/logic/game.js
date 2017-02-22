window.onload=function(){
	function Spirit(e){
		//this.size = null ;
		this.type = e ;
		this.turnStatus = 0 ;
		this.coupleStatus = 0 ;
		//this.model = new Image
	}
	Spirit.prototype = {
		createModel : function(type){
			 var url ='img/game/' ,
				imgArr  = [url+'1.png',url+'2.png',url+'3.png',url+'4.png',url+'5.png',url+'6.png'],
				img = new Image ;
			img.src = imgArr[type-1] ;
			this.model = img ;
			return this ;
		},
		initModel : function(x,y,rows,type){
			var size  = (game.bSize-60)/rows-(10-rows)*3 ;
			var left = parseFloat( (size+(10-rows)*3)*x+40 ) ;
			var top  =parseFloat( (size+(10-rows)*3)*y +40 )  ;
			this.size = size ;
			var $div  = $('<div></div>') ;
			$div.css({
				position:'absolute',
				width : size,
				height:size,
				left : left,
				top : top
			}).addClass('trunOff').bind('webkitAnimationEnd',function(){
				$(this).find('img').hide() ;
				$(this).removeClass('trunOff').unbind('webkitAnimationEnd') ;
				$(this).bind('touchstart',tap);
				$(this).bind('click',tap);
			});
			$div.append(this.model) ;
			$('#stage').append($div);

		},

	}
	function Game(){
		this.level = 0 ;
		this.curTime = 1 ;
		this.gameTime  = 60 ;
		this.score = 0 ;
		this.finishLevel = 0 ;
		this.bSize = 685 ;
		this.interval = null ;
		this.pause  = false ;
	};
	Game.prototype = {
		init : function(){
			$('#stage').css({width:this.bSize,height:this.bSize}).addClass('stage') ;
			$('#stage').hide() ;
			$('#time').hide() ;
			$('#level').parent().hide() ;
			var url ='img/game/' ;
			var imgArr  = [url+'1.png',url+'2.png',url+'3.png',url+'4.png',url+'5.png',url+'6.png'];
			this.loadImg(imgArr,function(){		 // 加载完成的回调
				//$('#guidePanel').bind('touchstart',function(){
					game.showPannel() ;
					game.start() ;
				//});
			});

		},
		loadImg : function(imgArr,foo){
			var i= 0;
			(function load(){
				var img = new Image();
				img.src = imgArr[i] ;
				img.onload = function(){
					i ++ ;
					if( i >=imgArr.length ){
						foo();
					}else{
						load();
					}
				};
			})();
		},
		showPannel : function(){
			$('#guidePanel').hide() ;
			$('#stage').show() ;
			$('#time').show() ;
			$('#level').parent().show() ;
		},
		start : function(){
			this.render() ;
			var timeBar = $('#timeBar') ;
			var self = this ;
			this.interval = setInterval(function(){
				if(self.curTime  == self.gameTime ){
					self.stop() ;
				}else{
					self.curTime ++ ;
					timeBar.css({width:(self.gameTime-self.curTime)/self.gameTime*100+'%'})
				}
			},1000) ;
		},
		check : function(curObj,i){
			curObj.addClass('trunOn').bind('webkitAnimationEnd',function(){
				$(this).removeClass('trunOn').unbind('webkitAnimationEnd');
				if( ! game.spiritNum){  //当前关卡是否全部匹配成功
					game.render() ;
				}
			}) ;
			curObj.find('img').show() ;
			var curIndex = i ;
			var coupleNum1 = 0 ;
			$.each(game.modelArr, function(index) {
				if( curIndex != index ){ //在比较对象中去除当前对象
					if(!this.coupleStatus && this.turnStatus ){ //去除已成对和未翻转对象
						if(this.type == game.modelArr[curIndex].type ){ //匹配正确
							this.	coupleStatus = 1 ;
							game.modelArr[curIndex].coupleStatus = 1 ;
							game.spiritNum -=2 ;
						}else{ //匹配错误
							this.turnStatus = 0 ;
							game.modelArr[curIndex].turnStatus = 0 ;
							setTimeout(function(){
								//$(this).bind('touchstart',tap);
								$('#stage div').eq(curIndex).bind('touchstart',tap).find('img').hide();
								$('#stage div').eq(index).bind('touchstart',tap).find('img').hide();
								$('#stage div').eq(curIndex).bind('click',tap).find('img').hide();
								$('#stage div').eq(index).bind('click',tap).find('img').hide();
							},300)

						}

					}
				}

			});
			//console.log(game.spiritNum)
			if( !game.spiritNum){  //当前关卡是否全部匹配成功
					game.finishLevel++ ;
				}
		},
		stop : function(){
			clearInterval( this.interval ) ;
			$('#stage div').unbind().removeClass('turnOff');
/*
			var s=strEnc(uuid+','+game.finishLevel);

			$.ajax({
				type:"post",
				url:"result.do",
				dataType : "json",
				data :{s:s},
				success:function(res){

					if(res.result == 'failed'){
						openModal({
							dTitle:"Times' Up", //有问题
							dWord:'<br /><br />您的分数不够！请再接再厉！<br /><br />'
						});
						$('#get').html('<a href="index.do">确定</a>');
						$('#btn').hide();
					}else if (res.result == 'error') {
						openModal({
							dTitle:"很抱歉！", //有问题
							dWord:'<br /><br />服务忙，请稍后再试！<br /><br />'
						});
						$('#get').html('<a href="index.do">确定</a>');
						$('#btn').hide();
					} else if (res.result == 'nochance') {
						openModal({
							dTitle:"很抱歉！", //有问题
							dWord:'<br /><br />您已经没有花朵了！<br />请邀请好友赐给您吧！<br /><br />'
						});
						$('#get').html('<a href="index.do">确定</a>');
						$('#btn').hide();
					} else if (res.result == 'geted') {
						openModal({
							dTitle:"很抱歉！", //有问题
							dWord:'<br /><br />您今天的奖励已经领取过了！<br />明天再来玩吧！<br /><br />'
						});
						$('#get').html('<a href="index.do">确定</a>');
						$('#btn').hide();
					} else if (res.result == 'canget') {

						openModal({
							dWord:'客官好眼力，闯过了<span id="thisScore" class="notice">'+res.currScore+'</span>关<br /><span>您今天的最好成绩为<span class="notice" id="bestScore">'+res.bestScore+'</span>关，<br />可获得<span class="notice"  id="flow">'+res.giftId+'</span>和学分<br /><span>每天只有一次领取机会，认真思考一下吧！</span><br />'
						});


						$("#get").bind('click',function(){
							$(this).unbind('click');
							$.post('creditExchange.do',{"uuid":res.uuid},function(res){
								if(res === 'y'){
									openModal({
										dWord : '您已进入和学分领取排队系统,<br/>您的和学分会尽快发放到<br/>您绑定的手机号码。<br/>领取结果请关注<br/>“我的战绩”页面。'
									});
									$('#get').html('<a href="http://rop.richeninfo.com/rop/credit/selectCredit.do?r='+r+'&r2='+r2+'">确定</a>');
									$('#btn').hide();
								}else if(res === "n"){
									openModal({
										'dTitle' : '很抱歉！',
										'dWord' : '<br /><br />您还没有活动领奖资格!<br /><br />'
									});
									$('#get').html('<a href="index.do">确定</a>');
									$('#btn').hide();
								}else if(res == "fail"){
									openModal({
										dTitle:'很抱歉!',
										dWord : '<br/><br/>你已经领取了该学分！<br /><br />'
									});
									$('#get').html('<a href="index.do">确定</a>');
									$('#btn').hide();
								} else {
									openModal({
										'dTitle' : '很抱歉！',
										'dWord' : '<br /><br />服务忙，请稍后再试!<br /><br />'
									});
									$('#get').html('<a href="index.do">确定</a>');
									$('#btn').hide();
								}
							}).fail(function( jqXHR, textStatus, errorThrown) {
							    if(jqXHR.status === 401){
							    	openModal({
										'dTitle' : '很抱歉！',
										'dWord' : '<br /><br />链接已经失效，请回到微信重新获取。<br /><br />'
									});
							    	$('#get').html('<a href="index.do">确定</a>');
							    	$('#btn').hide();
							    }else{
							    	openModal({
										'dTitle' : '很抱歉！',
										'dWord' : '<br /><br />服务忙，请稍后再试!<br /><br />'
									});
							    	$('#get').html('<a href="index.do">确定</a>');
							    	$('#btn').hide();
							    }
							 });
						});

					}else {
						openModal({
							dTitle:"很抱歉！", //有问题
							dWord:'<br /><br />服务忙，请稍后再试！<br /><br />'
						});
						$('#get').html('<a href="index.do">确定</a>');
						$('#btn').hide();
					}
		        },
		        error: function( jqXHR ,  textStatus,  errorThrown){
		        	if(jqXHR.status === 401){
						openModal({
							dTitle:"很抱歉！", //有问题
							dWord:'<br /><br />链接已经失效，请回到微信重新获取！<br /><br />'
						});
						$('#get').html('<a href="index.do">确定</a>');
						$('#btn').hide();
				    }else{
				    	openModal({
							dTitle:"很抱歉！", //有问题
							dWord:'<br /><br />服务忙，请稍后再试！<br /><br />'
						});
						$('#get').html('<a href="index.do">确定</a>');
						$('#btn').hide();
				    }

				}
			});

*/

			openModal({
				dTitle:"时间到！", //有问题
				dWord:'<p>客官好眼力啊！<br />闯过了'+game.finishLevel+'关</p>'
			});

		},
		render : function(){
			$('#level').html(this.level+1)
			this.modelArr =[];
			var cols =0;
			switch (true){
				case this.level < 3:
					$('#stage').html(' ') ;
						var  rows = 2 ;
						var roles = 2 ;
					break;
				case this.level < 6:
					$('#stage').html(' ') ;
					var  rows = 4 ;
					var roles = 3 ;
					break;
				case this.level < 8:
					$('#stage').html(' ') ;
					var  rows = 4 ;
					var roles = 4 ;
					break;
				case this.level < 9:
					$('#stage').html(' ') ;
					var  rows = 6 ;
					var roles = 5 ;
					break;
				case this.level < 10:
					$('#stage').html(' ') ;
					var  rows = 6 ;
					var roles = 6 ;
					break;
				default:
					game.stop();
					break;
			};
			var ArrList = this.randomNum([1,2,3,4,5,6],roles);
			if( rows >roles ){
					ArrList1 = this.randomNum(ArrList,rows/2);
				}
			var ll = 0;
			this.spiritNum = rows*rows;
			for(var x = 1 ; x <= rows*rows ; x++ ){
				var type = ArrList[x%rows];
				if( !type){
					type = ArrList1[ll%(rows/2)] ;
					ll++;
				}
				var spirit = new Spirit( type );
				this.modelArr.push( spirit.createModel(type) );
				spirit.initModel( cols,x%rows,rows,type ) ;
				if( x%rows == 0 ){
					cols++;
					ArrList = this.randomNum(ArrList,roles);
				}

			}
			this.level++;

		},
		randomNum : function(arr, num){
		    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
		    var temp_array = new Array();
		    for (var index in arr) {
		        temp_array.push(arr[index]);
		    }
		    //取出的数值项,保存在此数组
		    var return_array = new Array();
		    for (var i = 0; i<num; i++) {
		        //判断如果数组还有可以取出的元素,以防下标越界
		        if (temp_array.length>0) {
		            //在数组中产生一个随机索引
		            var arrIndex = Math.floor(Math.random()*temp_array.length);
		            //将此随机索引的对应的数组元素值复制出来
		            return_array[i] = temp_array[arrIndex];
		            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
		            temp_array.splice(arrIndex, 1);
		        } else {
		            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
		            break;
		        }
		    }
		    return return_array;

		}

	};
	var game = new Game();
	game.init() ;

		function tap(){
					$(this).unbind('touchstart') ;
					$(this).unbind('click') ;
					var i = $(this).index();
					if(!game.modelArr[i].turnStatus){ //是否处于正面
						game.modelArr[i].turnStatus = 1 ;
						game.check($(this),i) ;
					}

				}
}
