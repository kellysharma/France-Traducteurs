(function($, Models, Collections, Views) {
    $(document).ready(function() {
        Models.Message = Backbone.Model.extend({
            action: 'ae-sync-message',
            initialize: function() {}
        });
        Collections.Messages = Backbone.Collection.extend({
            model: Models.Message,
            action: 'ae-fetch-messages',
            initialize: function() {
                this.paged = 1;
            },
            comparator: function(m) {
                // var jobDate = new Date(m.get('comment_date'));
                // return -jobDate.getTime();
                return -m.get('ID');
            }
        });
        MessageItem = Views.PostItem.extend({
            tagName: 'li',
            className: 'message-item',
            template: _.template($('#ae-message-loop').html()),
            onItemBeforeRender: function() {
                // before render view
            },
            onItemRendered: function() {
                var view = this;
                // after render view
                view.$el.attr('id', 'comment-' + this.model.get('comment_ID'));
                if(this.model.get('isFile') == 'isFile'){
                    view.$el.addClass('isFile');
                }
                if( ae_globals.user_ID != this.model.get('user_id') ){
                    view.$el.addClass('partner-message-item');
                    view.$el.find('a.action.delete').remove();
                }
                else{
                    view.$el.find('.avatar-chat-wrapper').remove();
                }
            }
        });
        ListMessage = Views.ListPost.extend({
            tagName: 'li',
            itemView: MessageItem,
            itemClass: 'message-item',
            appendHtml: function(cv, iv){
                cv.$el.prepend(iv.el);
            }
        });
        
        // view control file upload
        Views.FileUploader = Backbone.View.extend({
            events: {
                'click .removeFile': 'removeFile'
            },
            fileIDs : [],
            docs_uploader : {},
            initialize: function(options) {
                _.bindAll(this, 'refresh');
                var view = this,
                    $apply_docs = this.$el,
                    uploaderID = options.uploaderID,
                    MAX_FILE_COUNT = options.MAX_FILE_COUNT;
                view.blockUi = new Views.BlockUi();
                view.newFile = false;
                view.result = '';
                // this.fileIDs = options.fileIDs;
                // this.docs_uploader = options.docs_uploader;
                this.docs_uploader = new AE.Views.File_Uploader({
                    el: $apply_docs,
                    uploaderID: uploaderID,
                    multi_selection: true,
                    unique_names: true,
                    upload_later: true,
                    filters: [{
                        title: "Compressed Files",
                        extensions: 'zip,rar'
                    }, {
                        title: 'Documents',
                        extensions: 'pdf,doc,docx,png,jpg,jpeg,gif,xls,xlsx'
                    }],
                    multipart_params: {
                        _ajax_nonce: $apply_docs.find('.et_ajaxnonce').attr('id'),
                        project_id: $apply_docs.find('.project_id').data('project'),
                        author_id: $apply_docs.find('.author_id').data('author'),
                        action: 'ae_upload_files',
                        imgType : 'file'
                    },  
                    cbAdded: function(up, files) {
                        var $file_list = view.$('.apply_docs_file_list'),
                            i;
                        // Check if the size of the queue is over MAX_FILE_COUNT
                        if (up.files.length > view.docs_uploader.MAX_FILE_COUNT) {
                            // Removing the extra files
                            while (up.files.length > view.docs_uploader.MAX_FILE_COUNT) {
                                up.removeFile(up.files[up.files.length - 1]);
                            }
                        }
                        // render the file list again
                        $file_list.empty();
                        for (i = 0; i < up.files.length; i++) {
                            $(view.fileTemplate({
                                id: up.files[i].id,
                                filename: up.files[i].name,
                                filesize: plupload.formatSize(up.files[i].size),
                                percent: up.files[i].percent
                            })).appendTo($file_list);
                        }
                        view.docs_uploader.controller.start();
                    },
                    cbRemoved: function(up, files) {
                        for (var i = 0; i < files.length; i++) {
                            view.$('#' + files[i].id).remove();
                        }
                        $.each(view.fileIDs, function( key, value){
                            if(files[0].name == value.name){
                                view.fileIDs.splice(key, 1);
                                return false;
                            }
                        });
                    },
                    onProgress: function(up, file) {
                        view.$('#' + file.id + " .percent").html(file.percent + "%");
                    },
                    cbUploaded: function(up, file, res) {
                        if (res.success) {
                            view.fileIDs.push(res.data);
                        } else {
                            // assign a flag to know that we are having errors
                            view.hasUploadError = true;
                            AE.pubsub.trigger('ae:notification', {
                                msg: res.msg,
                                notice_type: 'error'
                            });
                        }
                    },
                    onError: function(up, err) {
                        AE.pubsub.trigger('ae:notification', {
                            msg: err.message,
                            notice_type: 'error'
                        });
                        view.blockUi.unblock();
                    },
                    beforeSend: function() {
                        view.blockUi.block($apply_docs);
                    },
                    success: function(res) {
                        view.blockUi.unblock();
                        if(res.success){
                            var template = '<li class="attachment-'+res.attachment.ID+'">'+
                                                '<span class="file-attack-name"><a href="'+res.attachment.guid+'" target="_Blank">'+res.attachment.post_title+'</a></span>'+
                                                '<span class="file-attack-time">'+res.attachment.post_date+'</span>'+
                                                '<a href="#" data-id="'+res.attachment.ID+'" data-project="'+res.attachment.project_id+'" data-filename="'+res.attachment.post_title+'" class="removeAtt"><i class="fa fa-times pull-right" aria-hidden="true"></i></a>'+
                                            '</li>';
                            if(ae_globals.ae_is_mobile == '1'){
                                var template = '<li class="attachment-'+res.attachment.ID+'">'+
                                                '<span class="file-attack-name"><a href="'+res.attachment.guid+'" target="_Blank">'+res.attachment.post_title+'</a></span>'+
                                                '<span class="file-attack-time">'+res.attachment.post_date+'</span>'+
                                                '<a href="#" data-id="'+res.attachment.ID+'" data-project="'+res.attachment.project_id+'" data-filename="'+res.attachment.post_title+'" class="removeAtt"><i class="fa fa-times pull-right" aria-hidden="true"></i></a>'+
                                            '</li>';
                            }
                            $('.list-file-attack').prepend(template);
                            view.newFile = true;
                        }
                    }
                });
                // setup the maximum files allowed to attach in an application
                this.docs_uploader.MAX_FILE_COUNT = MAX_FILE_COUNT;
            },
            fileTemplate: _.template('<li id="{{=id}}"><span class="file-name" >{{=filename }}</span><a href="#"><i class="fa fa-times removeFile"></i></a></li>'),
            removeFile: function(e) {
                e.preventDefault();
                var fileID = $(e.currentTarget).closest('li').attr("id");
                for (i = 0; i < this.docs_uploader.controller.files.length; i++) {
                    if (this.docs_uploader.controller.files[i].id === fileID) {
                        this.docs_uploader.controller.removeFile(this.docs_uploader.controller.files[i]);
                    }
                }
            },
            removeAllFile : function(){
                var view = this;
                $.each(view.docs_uploader.controller.files, function (i, file) {
                    view.docs_uploader.controller.removeFile(file);
                });
            },
            refresh : function(){
                this.$('.apply_docs_file_list').html('');
                this.fileIDs = [];
            },
        });
        /**
         * project workspace control
         * @since 1.3
         * @author Dakachi
         */
        Views.WorkPlaces = Backbone.View.extend({
            events: {
                'click .removeAtt': 'removeAtt',
                'submit form.form-message': 'submitAttach',
                'click .message-item a.delete' : 'deleteCom'
            },
            initialize: function(options) {
                var view = this;
                view.blockUi = new Views.BlockUi();
                if ($('.message-container').find('.postdata').length > 0) {
                    var postsdata = JSON.parse($('.message-container').find('.postdata').html());
                    view.messages = new Collections.Messages(postsdata);
                } else {
                    view.messages = new Collections.Messages();
                }
                /**
                 * init list blog view
                 */
                this.listMessages = new ListMessage({
                    itemView: MessageItem,
                    collection: view.messages,
                    el: $('.message-container').find('.list-chat-work-place')
                });
                /**
                 * init block control list blog
                 */
                this.blockCT = new Views.BlockControl({
                    collection: view.messages,
                    el: $('.message-container')
                });
                // init upload file control
                this.docs_uploader = {};
                this.filecontroller = new Views.FileUploader({
                    el: $('#file-container'),
                    uploaderID: 'apply_docs',
                    fileIDs : [],
                    MAX_FILE_COUNT : 100
                });
                this.docs_uploader = this.filecontroller.docs_uploader;
                this.liveShowMsg();
                // Submit form when press Enter
                this.$el.find('textarea.content-chat').bind('keyup', function(e) {
                    if($(this).val().length == 0){
                        $('.submit-icon-msg').addClass('disabled');
                        $('input.submit-chat-content').addClass('disabled').attr('disabled','disabled');
                    }else{
                        $('.submit-icon-msg').removeClass('disabled');
                        $('input.submit-chat-content').removeClass('disabled').removeAttr('disabled');
                    }
                });
                this.$el.find('textarea.content-chat').bind('keypress', function(e) {
                    if(e.keyCode == 13 && $(this).val().length == 0){
                        return false;
                    }
                    if(e.keyCode == 13 && !e.shiftKey && $(this).val().length > 0){
                        e.preventDefault();
                        if($(this).val().length > 0){
                            view.$el.find('form').submit();
                        }
                    }
                });
                this.stopScroll = true;
                if(ae_globals.ae_is_mobile == '1') {
                    
                    $('.content-require-project-conversation .workplace-title-wrap').on('click', function() {
                        $('.section-single-project').toggleClass('single-project-conversation');
                        var hMobile = $(window).height();
                        var hasMobile = $('body').hasClass('is-mobile');
                        var hHeader = $('#header').outerHeight();
                        var hTitle = $('#workplace-title-conversation').outerHeight();
                        var hScrollConversation = hMobile - (hHeader + hTitle + 110);
                        $('.ScrollbarConversation').css({'height': hScrollConversation+'px'});
                        $('.list-chat-work-place-wrap').mCustomScrollbar('destroy');
                        $('.list-chat-work-place-wrap').mCustomScrollbar({
                            setHeight: hScrollConversation,
                            setTop:"-1000000px",
                            callbacks:{
                                onScroll: function(){
                                    if(this.mcs.top == 0){ // Scroll to Top
                                        view.loadMore();
                                    }
                                }
                            }
                        });
                        $('.form-content-chat-wrapper textarea.content-chat').height(40);
                        // if total less 5 
                        setInterval(function(){
                            var count_item = view.$el.find('.list-chat-work-place li').length;
                            if(count_item < 8 && view.stopScroll){
                                view.loadMore();
                            }
                        }, 5000);
                    });


                }else{
                    this.$el.find('.list-chat-work-place-wrap').mCustomScrollbar({
                        setHeight:500,
                        setTop:"-1000000px",
                        callbacks:{
                            onInit:function(){},
                            onUpdate:function(){},
                            onScroll : function(){
                                if(this.mcs.top == 0){ // Scroll to Top
                                    view.loadMore();
                                }
                            }
                        }
                    });

                    // if total less 5
                    if(view.$el.find('.list-chat-work-place').length > 0){
                        setInterval(function(){
                            var count_item = view.$el.find('.list-chat-work-place li').length;
                            if(count_item < 7 && view.stopScroll){
                                view.loadMore();
                            }
                        }, 5000);
                    }
                }
                
                // Fetch changelog
                AE.pubsub.on( 'ae:addChangelog', this.fetchChangelog, this );
            },
            fetchChangelog: function() {
                this.fetchListMessage();
            },
            submitAttach: function(e) {     
                var self = this;      
                var uploaded = false,     
                    $target = $(e.currentTarget);
                e.preventDefault();
                this.sendMessage($target);
            },
            sendMessage: function(target) {
                var message = new Models.Message(),
                    view = this,
                    $target = target;
                if($target.find('textarea.content-chat').val().length < 1){
                    return false;
                }
                $target.find('textarea, input, select').each(function() {
                    message.set($(this).attr('name'), $(this).val());
                });
                // message.set('fileID' , this.filecontroller.fileIDs);
                this.filecontroller.fileIDs = [];
                message.save('', '', {
                    beforeSend: function() {
                        view.blockUi.block($target);
                    },
                    success: function(result, res, xhr) {
                        view.blockUi.unblock();
                        view.$('textarea').val('');
                        view.$('textarea').height(38);
                        view.docs_uploader.controller.splice();
                        view.docs_uploader.controller.refresh();
                        if (res.success) {
                            var listMessages = view.listMessages,
                                template = _.template($('#ae-message-loop').html());
                            view.listMessages.$el.append('<li class="message-item" id="comment-'+message.get('ID')+'">'+template(message.toJSON())+'</li>');
                            $(".list-chat-work-place-wrap").mCustomScrollbar("scrollTo", "bottom");
                            $(".list-chat-work-place-none").remove();
                            $('input.submit-chat-content').addClass('disabled').attr('disabled','disabled');
                        } else {
                            AE.pubsub.trigger('ae:notification', {
                                msg: res.msg,
                                notice_type: 'error'
                            });
                        }
                    }
                });
            },
            loadMore: function(){
                var view_1 = this,
                    view = view_1.blockCT,
                    lengthModels =  view.collection.models.length,
                    $element = $('.list-chat-work-place li').first();
                view.page++;
                view.collection.fetch({
                    remove: false,
                    data: {
                        query: view.query,
                        page: view.page,
                        paged: view.page,
                        paginate: 'load_more',
                        action: 'ae-fetch-messages',
                    },
                    // get the thumbnail size of post and send to server
                    beforeSend: function() {
                        var infinite_scroll = '<div class="infinite_scroll"><div class="browser-screen-loading-content"><div class="loading-dots dark-gray"><i></i><i></i><i></i><i></i></div></div></div>';
                        if(view_1.stopScroll) {
                            $('.list-chat-work-place-wrap').prepend(infinite_scroll);
                        }
                    },
                    success: function(result, res, xhr) {
                        if(lengthModels == view.collection.models.length) {
                            view_1.stopScroll = false;
                        }
                        $('.list-chat-work-place-wrap').find('.infinite_scroll').remove();
                        $(".list-chat-work-place-wrap").mCustomScrollbar("scrollTo", $element);
                    }
                });
            },
            fetchListMessage: function(new_message) {
                var view = this;
                $(".list-chat-work-place-none").remove();
                if( $('#workspace_query_args').length > 0 ){
                    var template = _.template($('#ae-message-loop').html());
                    view.blockCT.query = JSON.parse($('#workspace_query_args').html());
                    $target = $('.message-container').find('.list-chat-work-place');
                    view.blockCT.query['use_heartbeat'] = 1;
                    view.blockCT.page = 1;
                    // view.blockCT.fetch($target);
                    jQuery.ajax({
                        type: "POST",
                        url: ae_globals.ajaxURL,
                        data: {
                            action        : 'ae-fetch-messages',
                            query: view.blockCT.query,
                            page: 1,
                            paged: 1,
                            paginate: view.blockCT.query.paginate,
                        },
                        action: 'ae-fetch-messages',
                        beforeSend: function() {},
                        success: function(result, res, xhr) {
                            if(result.success){
                                if( ae_globals.user_ID != result.data.user_id ){
                                    view.listMessages.$el.append('<li class="message-item partner-message-item '+result.data.isFile+'" id="comment-'+result.data.user_id+'">'+template(result.data)+'</li>');
                                }else{
                                    view.listMessages.$el.append('<li class="message-item '+result.data.isFile+'" id="comment-'+result.data.user_id+'">'+template(result.data)+'</li>');
                                }
                                $(".list-chat-work-place-wrap").mCustomScrollbar("scrollTo", "bottom");
                                
                                if(typeof new_message != undefined && new_message == true){
                                    // append template file
                                    $('.list-file-attack').prepend(result.data.template_file);
                                }
                                if(typeof result.data.remove_file != undefined){
                                    // remove item attachment
                                    var item = '.attachment-'+result.data.remove_file;
                                    $(item).remove();
                                }
                                view.filecontroller.newFile = false;
                            }   
                        }
                    });
                }
            },
            liveShowMsg: function(){
                var view = this;
                view.initHeartBeat();
                $(document).on( 'heartbeat-tick', function( event, data ) {
                    if(view.filecontroller.newFile){
                        view.fetchListMessage();
                    }
                    if ( data.hasOwnProperty( 'new_message' ) ) {
                        if( $('#workspace_query_args').length > 0 ){
                            if( data['new_message'] == 1 ){
                                var new_message = true;
                                view.fetchListMessage(new_message);
                            }
                        }
                    }
                });
            },
            initHeartBeat: function(){
                var view = this;
                $(document).on('heartbeat-send', function(e, data) {
                    if( $('#workspace_query_args').length > 0 ){
                        var qr = JSON.parse($('#workspace_query_args').html());
                        if(typeof qr['post_id'] !== 'undefined'){
                            data['new_message'] = qr['post_id'];
                        }
                    }
                });
            },
            removeAtt: function(e){
                var view = this;
                if (confirm(ae_globals.confirm_message)) {
                    e.preventDefault();
                    var post_id = $(e.currentTarget).attr('data-id');
                    var filename = $(e.currentTarget).attr('data-filename');
                    var project_id = $(e.currentTarget).attr('data-project');
                    var data = {
                        'action'        : 'free_remove_attack_file',
                        'post_id'       : post_id,
                        'file_name'     : filename,
                        'project_id'    : project_id 
                    };
                    view.deleteFile = post_id;
                    jQuery.ajax({
                        type: "POST",
                        url: ae_globals.ajaxURL,
                        data: data,
                        action: 'free_remove_attack_file',
                        success: function(data) {
                            if(data!=="0"){
                                var item = '.attachment-'+post_id;
                                $(item).remove();
                                view.filecontroller.newFile = true;
                                AE.pubsub.trigger('ae:notification', {
                                    msg: fre_fronts.deleted_file_successfully,
                                    notice_type: 'success',
                                });
                            } else {
                                AE.pubsub.trigger('ae:notification', {
                                    msg: fre_fronts.failed_deleted_file,
                                    notice_type: 'error',
                                });
                                setTimeout(function(){
                                    location.reload();
                                }, 3000);
                            }
                        }
                    });
                    
                }
            },
            deleteCom : function(e){
                e.preventDefault();
                var view = this,
                    comment_id = $(e.currentTarget).attr('data-id'),
                    element = '#comment-' + comment_id;
                jQuery.ajax({
                    type: "POST",
                    url: ae_globals.ajaxURL,
                    data: {
                        action  : 'free_trash_comment',
                        comment_ID      : comment_id
                    },
                    action: 'free_trash_comment',
                    beforeSend: function() {
                        view.blockUi.block($(element));
                    },
                    success: function(res) {
                        if(res.success){
                            $(element).remove();
                        }else{
                            AE.pubsub.trigger('ae:notification', {
                                msg: res.msg,
                                notice_type: 'error',
                            });
                        }
                        view.blockUi.unblock();
                    }
                });
            }
        });
        new Views.WorkPlaces({
            el: 'div.workplace-details'
        });
    })
})(jQuery, window.AE.Models, window.AE.Collections, window.AE.Views);
/**
 * report control view
 * @author Dakachi
 */
(function($, Models, Collections, Views) {
    $(document).ready(function() {
        Models.Report = Backbone.Model.extend({
            action: 'ae-sync-report',
            initialize: function() {}
        });
        Collections.Reports = Backbone.Collection.extend({
            model: Models.Message,
            action: 'ae-fetch-reports',
            initialize: function() {
                this.paged = 1;
            },
            comparator: function(m) {
                // var jobDate = new Date(m.get('comment_date'));
                // return -jobDate.getTime();
                return -m.get('ID');
            }
        });
        ReportItem = Views.PostItem.extend({
            tagName: 'li',
            className: 'message-item',
            template: _.template($('#ae-report-loop').html()),
            onItemBeforeRender: function() {
                // before render view
            },
            onItemRendered: function() {
                // after render view
            }
        });
        ListReport = Views.ListPost.extend({
            tagName: 'li',
            itemView: MessageItem,
            itemClass: 'message-item',
            appendHtml: function(cv, iv, index) {
                var post = index,
                    $existingItems = cv.$('li.message-item'),
                    index = (index) ? index : $existingItems.length,
                    position = $existingItems.eq(index - 1),
                    $itemView = $(iv.el);
                if (!post || position.length === 0) {
                    cv.$el.prepend(iv.el);
                } else {
                    $itemView.insertAfter(position);
                }
            }
        });

        Views.ReportPlaces = Backbone.View.extend({
            events: {
                'submit form.form-report': 'submitAttach'
            },
            initialize: function(options) {
                var view = this;
                view.blockUi = new Views.BlockUi();
                if ($('.report-container').find('.postdata').length > 0) {
                    var postsdata = JSON.parse($('.report-container').find('.postdata').html());
                    view.messages = new Collections.Messages(postsdata);
                } else {
                    view.messages = new Collections.Messages();
                }
                /**
                 * init list blog view
                 */
                this.ListMsg = new ListMessage({
                    itemView: ReportItem,
                    collection: view.messages,
                    el: $('.report-container').find('.list-chat-work-place')
                });
                /**
                 * init block control list blog
                 */
                new Views.BlockControl({
                    collection: view.messages,
                    el: $('.report-container')
                });

                // init upload file control
                this.docs_uploader = {};
                this.filecontroller = new Views.FileUploader({
                    el: $('#report_docs_container'),
                    uploaderID: 'report_docs',
                    fileIDs : [],
                    MAX_FILE_COUNT : 3
                });
                
                this.docs_uploader = this.filecontroller.docs_uploader;
                $('.content-require-project-report .workplace-title-wrap').on('click', function() {
                    $('.section-single-project').toggleClass('single-project-report');
                });
                this.initValidator();
            },
            initValidator: function() {
                this.submitReport = $("form.form-report").validate({
                    rules: {
                        comment_content: "required"
                    },
                    validClass: "valid", // the classname for a valid element container
                    errorClass: "message", // the classname for the error message for any invalid element
                    errorElement: 'div', // the tagname for the error message append to an invalid element container
                    highlight: function(element, errorClass) {
                        $(element).closest('.fre-input-field').addClass('error');
                    },
                    unhighlight(element, errorClass) {
                        $(element).closest('.fre-input-field').removeClass('error');
                    }
                });
            },
            submitAttach: function(e) {
                var self = this;
                var uploaded = false,
                    $target = $(e.currentTarget);
                e.preventDefault();
                if (this.submitReport.form() && !$target.hasClass("processing")) {
                    if (this.docs_uploader.controller.files.length > 0) {
                        this.docs_uploader.controller.bind('StateChanged', function(up) {
                            if (up.files.length === up.total.uploaded) {
                                // if no errors, post the form
                                if (!self.hasUploadError && !uploaded) {
                                    self.sendMessage($target);
                                    uploaded = true;
                                }
                            }
                        });
                        this.hasUploadError = false; // reset the flag before re-upload
                        this.docs_uploader.controller.start();
                    } else {
                        this.sendMessage($target);
                    }
                }
            },
            sendMessage: function(target) {
                var message = new Models.Report(),
                    view = this,
                    $target = target;
                $target.find('textarea, input, select').each(function() {
                    message.set($(this).attr('name'), $(this).val());
                });
                message.set('fileID' , this.filecontroller.fileIDs);
                this.filecontroller.fileIDs = [];
                message.save('', '', {
                    beforeSend: function() {
                        view.blockUi.block($target);
                    },
                    success: function(result, res, xhr) {
                        view.blockUi.unblock();
                        view.$('textarea').val('');
                        view.docs_uploader.controller.splice();
                        view.docs_uploader.controller.refresh();
                        if (res.success) {
                            view.messages.add(message);
                            view.ListMsg.render();
                            window.location.reload();
                        } else {
                            AE.pubsub.trigger('ae:notification', {
                                msg: res.msg,
                                notice_type: 'error'
                            });
                        }
                    }
                });                
            }
        });
        new Views.ReportPlaces({
            el: 'div.report-details'
        });
        
        $('.workplace-title > h4, .workplace-title-arrow > span').on('click', function(event) {
            var target = event.currentTarget;
            $(target).parents('.content-require-project').toggleClass('active');
        });

        if(!$('.workplace-project-details').hasClass('dispute')){
            $('.workplace-project-details').mCustomScrollbar({
                setHeight:600,
                callbacks:{
                    onInit:function(){},
                    onUpdate:function(){},
                    /*onScroll : function() {
                        if(this.mcs.top == 0){ // Scroll to Top
                            viewBlock.loadMore();
                        }
                    }*/
                }
            });
        }
    })
})(jQuery, window.AE.Models, window.AE.Collections, window.AE.Views);