(function($, Models, Collections, Views) {
    /*
     *
     * E D I T  P R O F I L E  V I E W S
     *
     */
    Views.Profile = Backbone.View.extend({
        el: '.list-profile-wrapper',
        events: {
            // user account details
            'submit form#account_form': 'saveAccountDetails',
            // user profile details
            'submit form#profile_form': 'saveProfileDetails',
            // open modal add portfolio
            'click a.add-portfolio': 'openModalPorfolio',
            // open modal change password
            'click a.change-password': 'openModalChangePW',
            // request confirm mail
            'click a.request-confirm': 'requestConfirmMail',
            'click .dropbox': 'showlistvalue',
            'click #et_receive_mail' : 'setReceiveMail',
        },
        setReceiveMail: function(){
            var value = $("#et_receive_mail_value");
            value.val(value.val() == 0 ? 1 : 0);
        },
        // request a confirm email   
        requestConfirmMail: function(e) {
            e.preventDefault();
            var $target = $(e.currentTarget),
                view = this;
            this.user.confirmMail({
                beforeSend: function() {
                    view.blockUi.block($target);
                },
                success: function(result, res, xhr) {
                    view.blockUi.unblock();
                    AE.pubsub.trigger('ae:notification', {
                        msg: res.msg,
                        notice_type: (res.success) ? 'success' : 'error',
                    });
                }
            });
        },
        /**
         * init view setup Block Ui and Model User
         */
        initialize: function() {

            $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
                var $target = $(e.target);
                var $tabs = $target.closest('.nav-tabs-responsive');
                var $current = $target.closest('li');
                var $parent = $current.closest('li.dropdown');
                    $current = $parent.length > 0 ? $parent : $current;
                var $next = $current.next();
                var $prev = $current.prev();
                var updateDropdownMenu = function($el, position){
                  $el
                    .find('.dropdown-menu')
                    .removeClass('pull-xs-left pull-xs-center pull-xs-right')
                    .addClass( 'pull-xs-' + position );
                };

                $tabs.find('>li').removeClass('next prev');
                $prev.addClass('prev');
                $next.addClass('next');
                
                updateDropdownMenu( $prev, 'left' );
                updateDropdownMenu( $current, 'center' );
                updateDropdownMenu( $next, 'right' );
            });
            //set current profile
            if ($('#current_profile').length > 0) {
                this.profile = new Models.Profile(JSON.parse($('#current_profile').html()));
            } else {
                this.profile = new Models.Profile();
            }
            var view = this;
            this.blockUi = new Views.BlockUi();
            this.user = AE.App.user;
            //get id from the url
            var hash = window.location.hash;
            hash && $('ul.nav a[href="' + hash + '"]').tab('show');

            // update value for post content editor
            if (typeof tinyMCE !== 'undefined') {
                setTimeout(function(){
                    tinymce.EditorManager.execCommand('mceAddEditor', true, "post_content");
                    tinymce.EditorManager.get('post_content').setContent(view.profile.get('post_content'));
                },1000);
            }
            //new skills view
            new Views.Skill_Control({
                model: this.profile,
                el: view.$('.skill-profile-control'),
                name : 'skill',
                max_length : ae_globals.max_skill
            });
            

            if ($('.edit-portfolio-container').length > 0) {
                var $container = $('.edit-portfolio-container');
                //portfolio list control
                if ($('.edit-portfolio-container').find('.postdata').length > 0) {
                    var postdata = JSON.parse($container.find('.postdata').html());
                    this.portfolios_collection = new Collections.Portfolios(postdata);
                } else {
                    this.portfolios_collection = new Collections.Portfolios();
                }
                /**
                 * init list portfolio view
                 */
                new ListPortfolios({
                    itemView: PortfolioItem,
                    collection: this.portfolios_collection,
                    el: $container.find('.list-item-portfolio')
                });
                /**
                 * init block control list blog
                 */
                new Views.BlockControl({
                    collection: this.portfolios_collection,
                    el: $container
                });
            }
            //button available
            var availableCheckbox = document.querySelector('.user-available');
            if ($('.user-available').length > 0) {
                if($('.user-status-text').hasClass('no'))
                {
                    $('.user-available').parents('.switch-for-hide').find('small').css({
                        "left" :  -5 + "px"
                    })
                }
                availableCheckbox.onchange = function(event) {
                    var _this = $(event.currentTarget);
                    var _switch = _this.parents('.switch-for-hide');
                    if (availableCheckbox.checked) {
                        $('.switch-for-hide span.text').text(ae_globals.yes).removeClass('no').addClass('yes');
                        _switch.find('small').css({
                            "left" :  (_switch.find('.switchery').width() - _switch.find('small').width() + 5) + "px"
                        })
                    } else {
                        $('.switch-for-hide span.text').text(ae_globals.no).removeClass('yes').addClass('no');
                        _switch.find('small').css({
                            "left" :  -5 + "px"
                        })
                    }
                    //alert(availableCheckbox.checked);
                    view.user.save('user_available', availableCheckbox.checked ? "on" : "off", {
                        beforeSend: function() {
                            view.blockUi.block($('.switchery'));
                        },
                        success: function(res) {
                            view.blockUi.unblock();
                        }
                    });
                };
            }

            this.uploaderID = 'user_avatar';
            var $container = $("#user_avatar_container");
            //init avatar upload
            if (typeof this.avatar_uploader === "undefined") {
                this.avatar_uploader = new AE.Views.File_Uploader({
                    el: $container,
                    uploaderID: this.uploaderID,
                    thumbsize: 'thumbnail',
                    multipart_params: {
                        _ajax_nonce: $container.find('.et_ajaxnonce').attr('id'),
                        data: {
                            method: 'change_avatar',
                            author: view.user.get('ID')
                        },
                        imgType: this.uploaderID,
                    },
                    cbUploaded: function(up, file, res) {
                        if (res.success) {
                            $('#' + this.container).parents('.desc').find('.error').remove();
                        } else {
                            $('#' + this.container).parents('.desc').append('<div class="error">' + res.msg + '</div>');
                        }
                    },
                    beforeSend: function(ele) {
                        button = $(ele).find('.image');
                        view.blockUi.block(button);
                    },
                    success: function(res) {
                        if (res.success === false) {
                            AE.pubsub.trigger('ae:notification', {
                                msg: res.msg,
                                notice_type: 'error',
                            });
                        }
                        view.blockUi.unblock();
                    }
                });
            }
            var moveIt = $(".user-status-text").remove();
            $(".switchery").append(moveIt);
            this.$('.cat_profile').chosen({
                max_selected_options:parseInt(ae_globals.max_cat),
                width: '350px'
            });
            this.$('.country_profile').chosen({
                width: '350px'
            });
            //handle change password in mobile
            if (ae_globals.ae_is_mobile) {
                this.modalChangePW = new Views.Modal_Change_Pass({
                    el: '#tab_change_pw'
                });
            };
            this.$('.sw_skill').chosen({
                max_selected_options:parseInt(ae_globals.max_skill),
                inherit_select_classes: true,
                width: '100%',
            });
            // about_content

        },
        /**
         * init form validator rules
         * can override this function by using prototype
         */
        initValidator: function() {
            // login rule
            this.account_validator = $("form#account_form").validate({
                rules: {
                    display_name: "required",
                    user_email: {
                        required: true,
                        email: true
                    }
                }
            });
            /**
             * register rule
             */
            this.profile_validator = $("form#profile_form").validate({
                ignore: "",
                rules: {
                    et_professional_title: "required",
                    country: "required",
                    hour_rate: {
                        required: true,
                        number: true
                    },
                    et_experience : {
                        number : true,
                        min: 0
                    },
                },
                highlight: function(element, errorClass, validClass) {
                    if($(element).attr('type') == 'checkbox'){
                        var required_id = $(element).attr('id');
                        var $container = $(element).closest('div');
                        if (!$container.hasClass('error')) {
                            // $container.addClass('error').removeClass(validClass).append('<i class="fa fa-exclamation-triangle" ></i>');
                            $container.addClass('error').removeClass(validClass);
                            $container.find('i').wrap("<div class='errorCheckbox'></div>");
                            setTimeout(function(){
                                $container.find('.errorCheckbox').append($container.find('div.message'));    
                            },200);
                        }
                    }else{
                        var required_id = $(element).attr('id');
                        var $container = $(element).closest('div');
                        if (!$container.hasClass('error')) {
                            // $container.addClass('error').removeClass(validClass).append('<i class="fa fa-exclamation-triangle" ></i>');
                            $container.addClass('error').removeClass(validClass);
                        }
                    }
                },
                unhighlight: function(element, errorClass, validClass) {
                    var $container = $(element).closest('div');
                    if ($container.hasClass('error')) {
                        $container.removeClass('error').addClass(validClass);
                    }
                    $container.find('div.message').remove().end().find('i.fa-exclamation-triangle').remove();
                    if($(element).attr('type') == 'checkbox'){
                        $container.find('.errorCheckbox').remove();
                    }
                }
            });
        },
        showlistvalue: function(event){
            event.preventDefault();
            if($('.list-value').hasClass('hide'))
            {
                $('.list-value').removeClass('hide');
            }else{
                $('.list-value').addClass('hide');
            }
        },
        /**
         * user profile, catch event when user submit profile form
         */
        saveAccountDetails: function(event) {
            event.preventDefault();
            event.stopPropagation();
            /**
             * call validator init
             */
            this.initValidator();
            var form = $(event.currentTarget),
                button = form.find('.fre-btn'),
                view = this;
            /**
             * scan all fields in form and set the value to model user
             */
            form.find('input, textarea, select').each(function() {
                view.user.set($(this).attr('name'), $(this).val());
            });
            // check form validate and process sign-in
            if (this.account_validator.form() && !form.hasClass("processing")) {
                this.user.set('do', 'profile');
                this.user.request('update', {
                    beforeSend: function() {
                        view.blockUi.block(button);
                        form.addClass('processing');
                    },
                    success: function(profile, status, jqXHR) {
                        view.blockUi.unblock();
                        form.removeClass('processing');
                        // trigger event process authentication
                        AE.pubsub.trigger('ae:user:account', profile, status, jqXHR);
                        // trigger event notification
                        if (status.success) {
                            AE.pubsub.trigger('ae:notification', {
                                msg: status.msg,
                                notice_type: 'success',
                            });
                            setTimeout(function(){
                                window.location.reload();
                            },2500);
                        } else {
                            AE.pubsub.trigger('ae:notification', {
                                msg: status.msg,
                                notice_type: 'error',
                            });
                        }
                    }
                });
            }
        },
        /**
         * user profile, catch event when user submit profile form
         */
        saveProfileDetails: function(event) {
            event.preventDefault();
            event.stopPropagation();
            /**
             * call validator init
             */
            this.initValidator();
            var form = $(event.currentTarget),
                button = form.find('.btn-submit'),
                view = this,
                temp = new Array();
            /**
             * scan all fields in form and set the value to model user
             */
            form.find('input, textarea, select').each(function() {
                if( $(this).attr('name') != 'skill' ){
                    view.profile.set($(this).attr('name'), $(this).val());
                }
                else{
                    view.profile.set($(this).attr('name'), $(this).val());
                }
            });
            /**
             * update input check box to model
             */
            form.find('input[type=checkbox]').each(function(){
                var name = $(this).attr('name');
                if (name !== "et_receive_mail_check") {
                    view.profile.set(name, null);
                }
            });
            form.find('input[type=checkbox]:checked').each(function() {
                var name = $(this).attr('name');
                if (typeof temp[name] !== 'object') {
                    temp[name] = new Array();
                }
                temp[name].push($(this).val());
                view.profile.set(name, temp[name]);
            });
            /**
             * update input radio to model
             */
            form.find('input[type=radio]:checked').each(function() {
                view.profile.set($(this).attr('name'), $(this).val());
            });

            // check form validate and process sign-in
            if (this.profile_validator.form() && !form.hasClass("processing")) {
                this.profile.save('', '', {
                    beforeSend: function() {
                        view.blockUi.block(button);
                        form.addClass('processing');
                    },
                    success: function(profile, status, jqXHR) {
                        view.blockUi.unblock();
                        form.removeClass('processing');
                        // trigger event process authentication
                        AE.pubsub.trigger('ae:user:profile', profile, status, jqXHR);
                        // trigger event notification
                        if (status.success) {
                            AE.pubsub.trigger('ae:notification', {
                                msg: status.msg,
                                notice_type: 'success',
                            });

                            // if(ae_globals.checkProfile == 0){
                            //     $('.notice-first-login').hide();
                            // }
                            if(ae_globals.ae_is_mobile == 1){
                                hash = '#tab_profile';
                            }else{
                                hash = '#tab_profile_details';    
                            }
                            if(location.hash == hash){
                                location.reload();
                            }else{
                                location.href += hash;
                                location.reload();
                            }
                            //window.location.reload();
                        } else {
                            AE.pubsub.trigger('ae:notification', {
                                msg: status.msg,
                                notice_type: 'error',
                            });
                        }
                    }
                });
            }
        },
        getUrlParameter : function(sParam){
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        },
        openModalPorfolio: function(event) {
            event.preventDefault();
            var portfolio = new Models.Portfolio();
            if (typeof this.modalPortfolio === 'undefined') {
                this.modalPortfolio = new Views.Modal_Add_Portfolio({
                    el: '#modal_add_portfolio',
                    collection: this.portfolios_collection,
                    // model: portfolio
                });
            }
            this.modalPortfolio.setModel(portfolio, this.profile);
            this.modalPortfolio.openModal();
        },
        openModalChangePW: function(event) {
            event.preventDefault();
            this.modalChangePW = new Views.Modal_Change_Pass({
                el: '#modal_change_pass'
            });
            this.modalChangePW.openModal();
        },
    });
    /*
     *
     * M O D A L  A D D  P O R T F O L I O  V I E W S
     *
     */
    Views.Modal_Add_Portfolio = Views.Modal_Box.extend({
        events: {
            // user register
            'submit form.create_portfolio': 'createPortfolio',
        },
        /**
         * init view setup Block Ui and Model User
         */
        initialize: function() {
            this.user = AE.App.user;
            this.blockUi = new Views.BlockUi();
            this.initValidator();
            // upload file portfolio image
            this.uploaderID = 'portfolio_img';
            var $container = $("#portfolio_img_container"),
                view = this;
            //init chosen
            this.$('#skills').chosen({
                width: '330px'
            });
            //if (typeof this.portfolio_uploader === "undefined") {
            var author_id = view.user.get('ID');
            var upload_id = this.uploaderID;
            $('#modal_add_portfolio').on('shown.bs.modal', function () {
                if (typeof this.portfolio_uploader === "undefined") {
                    this.portfolio_uploader = new AE.Views.File_Uploader({
                        el: $container,
                        uploaderID: upload_id,
                        drop_element: 'portfolio_img_container',
                        thumbsize: 'portfolio',
                        multipart_params: {
                            _ajax_nonce: $container.find('.et_ajaxnonce').attr('id'),
                            data: {
                                method: 'add_portfolio',
                                author: author_id
                            },
                            imgType: upload_id,
                        },
                        extensions : 'pdf,doc,docx,png,jpg,gif,zip',
                        cbUploaded: function(up, file, res) {
                            if (res.success) {
                                $('#' + this.container).find("input#post_thumbnail").val(res.data.attach_id);
                                $('#' + this.container).parents('.desc').find('.error').remove();
                            } else {
                                $('#' + this.container).parents('.desc').append('<div class="error">' + res.msg + '</div>');
                            }
                        },
                        beforeSend: function(ele) {
                            button = $(ele).find('.image');
                            view.blockUi.block(button);
                        },
                        success: function(res) {
                            if (res.success === false) {
                                AE.pubsub.trigger('ae:notification', {
                                    msg: res.msg,
                                    notice_type: 'error',
                                });
                            }
                            view.blockUi.unblock();
                        }
                    });
                    var sAgent = window.navigator.userAgent,
                    Ya = sAgent.indexOf("YaBrowser"),
                    iPad = sAgent.indexOf('iPad');
                   // Browser is Yandex
                   if(Ya > 0 || iPad > 0){
                        this.portfolio_uploader.controller.init();
                        this.portfolio_uploader.controller.refresh();
                    }
                }
            });
           // }
        },
        setModel: function(model, profile) {
            this.portfolio = model; //new Models.Portfolio();
            this.profile = profile;
            this.setupFields();
        },
        setupFields: function() {
            var view = this;
            this.$('.form-group').find('input').each(function() {
                $(this).val(view.portfolio.get($(this).attr('name')));
            });
            view.$("#portfolio_img_thumbnail").html('');
            var skill = this.profile.get('tax_input');

            if(typeof skill != 'undefined'){
                if( typeof skill.skill ) {
                    skill = skill.skill;
                }
            }else{
                skill = '';
            }
            var html = '';
            if( skill.length > 0 ) {
                for( i = 0; i< skill.length; i++ ){
                    html += '<option value="' + skill[i].slug + '">'+skill[i].name+'</option>';
                }
            }
            view.$el.find('#skills').html(html);
            this.$('#skills').trigger('chosen:updated');
        },
        resetUploader: function() {
            if (typeof this.portfolio_uploader === 'undefined') return;
            this.portfolio_uploader.controller.splice();
            this.portfolio_uploader.controller.refresh();
            this.portfolio_uploader.controller.destroy();
        },
        /**
         * init form validator rules
         * can override this function by using prototype
         */
        initValidator: function() {
            /**
             * register rule
             */
            this.portfolio_validator = $("form.create_portfolio").validate({
                rules: {
                    post_title: "required",
                    post_thumbnail: "required",
                }
            });
        },
        /**
         * user sign-up catch event when user submit form signup
         */
        createPortfolio: function(event) {
            event.preventDefault();
            event.stopPropagation();
            /**
             * call validator init
             */
            this.initValidator();
            var form = $(event.currentTarget),
                button = form.find('button.fre-submit-portfolio'),
                view = this;
            /**
             * scan all fields in form and set the value to model user
             */
            form.find('input, textarea, select').each(function() {
                view.portfolio.set($(this).attr('name'), $(this).val());
            });
            // check if user has selected an image!
            if ($("#post_thumbnail").val() == "0") {
                AE.pubsub.trigger('ae:notification', {
                    msg: fre_fronts.portfolio_img,
                    notice_type: 'error'
                });
                return false;
            }
            // check form validate and process sign-up
            if (this.portfolio_validator.form() && !form.hasClass("processing")) {
                this.portfolio.save('', '', {
                    beforeSend: function() {
                        view.blockUi.block(button);
                        form.addClass('processing');
                    },
                    success: function(portfolio, status, jqXHR) {
                        view.blockUi.unblock();
                        form.removeClass('processing');
                        // trigger event process authentication
                        AE.pubsub.trigger('ae:portfolio:create', portfolio, status, jqXHR);

                        if (status.success) {
                            // add to collection
                            view.collection.add(portfolio, {
                                at: 0
                            });
                            AE.pubsub.trigger('ae:notification', {
                                msg: status.msg,
                                notice_type: 'success'
                            });
                            // close modal
                            view.closeModal();
                            // reset form
                            // form.reset();
                        } else {
                            AE.pubsub.trigger('ae:notification', {
                                msg: status.msg,
                                notice_type: 'error'
                            });
                        }
                    }
                });
            }
        }

    });
// Views.Profile.prototype.initValidator = function() {
//     // login rule
//     this.account_validator = $("form#account_form").validate({
//         rules: {
//             display_name: "required",
//             user_email: {
//                 required: true,
//                 email: true
//             }
//         }
//     });
//     /**
//      * register rule
//      */
//     this.profile_validator = $("form#profile_form").validate({
//         rules: {
//             et_professional_title: "required",
//             country: "required",
//             // hour_rate: {
//             //     required: true,
//             //     number: true
//             // },
//             et_experience : {
//                 number : true
//             }
//         }
//     });
// }
})(jQuery, window.AE.Models, window.AE.Collections, window.AE.Views);
