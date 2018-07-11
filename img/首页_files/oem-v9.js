$(function(){

    //测试环境对应的帐号：test1@qwe.com 123456
    if(BSGlobal.tenantInfo.Id == 310040 ||  (BSGlobal.tenantInfo.Id == 200004 && BSGlobal.env == "Testing")){
    //if(BSGlobal.tenantInfo.Id == 204200){

        $('body').off('.loadSuccess');
        //全局查找页面要做(隐藏类型和来源) ok
        $('body').on('OEMGlobalFind.loadSuccess',function(e){
            try{
                $('.tt-new-filtter-tab-list li[data-tab-name=scope]').hide();
                $('.tt-new-filtter-tab-list li[data-tab-name=source]').hide();
            }catch(err){
                throw err;
            }
        })

        //动态页面要做(隐藏工作计划) ok
         $('body').on('OEMGlobalFeed.loadSuccess',function(e){
             try{
                 $('li#101.item-tab')[0].style.cssText='display:none';
             }catch(err){
                 throw err;
             }
         })

         //根据域名改title－－－－－－
         $('body').on('OEMGlobalUrl.loadSuccess',function(e){
             try{
                 if(window.location.hostname === 'c.ccycloud.cn'){
                    $('title')[0].innerHTML='创客CFO';

                    
                }
             }catch(err){
                 throw err;
             }
         })

         //改ico－－－－－－
         $('body').on('OEMGlobalIco.loadSuccess',function(e){
             try{
                if(location.hash == '#platform'){
                     location.hash = '#home';
                }
                var newNavigation = window.BSGlobal.newNavigation;
                if(newNavigation){
                     window.BSGlobal.newNavigation = newNavigation.slice(1,newNavigation.length);
                }
                $('head')[0].innerHTML += ' <link rel="shortcut icon" href="http://st-web.tita.com/ux/tita-web-v4/release/app/extras/images/oem/chuangkecfo.ico" type="image/x-icon">'
                $('head')[0].innerHTML += '<style type="text/css">div#clinic-btn-start{display:none!important}</style>'


             }catch(err){
                 throw err;
             }
             
         })

         // 将在线客服去掉
		$('body').on('OEMHideCustomerService.loadSuccess',function(){
            try{
                $('#BizQQWAP').hide();
            }catch(err){
                throw err;
            }
		});

		// 将菜单栏中的Italent首页、仪表盘、报表去掉
		$('body').on('OEMHideItalentIndex.loadSuccess',function(e,node){
            try{
                $(node).find('.menuItem5158-region').hide();
                $(node).find('.menuItem5160-region').hide();
                $(node).find('.menuItem6175-region').hide();
            }catch(err){
                throw err;
            }
		});

		// 将顶部菜单栏中的九宫格去掉
		$('body').on('OEMHideHomePageHeader.loadSuccess',function(e,node){
            try{
               $(node).find('.HomePage-region').hide();
            }catch(err){
                throw err;
            }
		});

		// 将sitemap 页面中的计划,Ocean 去掉
		$('body').on('OEMHideHomePageSitemap.loadSuccess',function(){
            try{
                $('.list-group .list-group-item:nth-child(1)').hide();
                $('.list-group .list-group-item:nth-child(2)').hide();
            }catch(err){
                throw err;
            }
		});



		// 将点击个人设置中的撤销账号去掉		
		$('body').on('OEMHideCancelAccount.loadSuccess',function(e,node){
            try{
                $(node).find('li:nth-child(11)').hide();
            }catch(err){
                throw err;
            }

		});

		// 将动态页面中的右侧的常用链接、手机客户端下载去掉，二维码换掉
		$('body').on('OEMHideHome.loadSuccess',function(){
            try {
                // 将动态页面中的右侧的常用链接去掉
                $('.tt_home_right_view .tt_incommonlink').hide();
                 //将动态页面中的右侧的下载去掉
                $('.tt_home_right_view .tt_downloadmobile')[1].style.display='none';
                 //将动态页面中的二维码换掉－－－－－－
                 var imgSrc = 'http://st-web.tita.com/ux/tita-web-v4/release/app/extras/images/oem/wechat-chuangkecfo.jpg';
                $('.tt_home_right_view .tt_downloadmobile .weixin img')[0].src=imgSrc;
                $('.tt_home_right_view .tt_downloadmobile .weixin img').css('marginLeft','-9px');
                $('.tt_home_right_view .tt_downloadmobile .title').html('微信公众号');
            } catch (err) {
                throw err;
            }
		});


		// 将今日工作页面中的tita入门，帮助
		$('body').on('OEMHideBenchHelp.loadSuccess',function(){
            try {
                $('.down_tb').hide();
                $('.tita-help-wrap').hide();
            } catch (err) {
                throw err
            }
		});
    }


})