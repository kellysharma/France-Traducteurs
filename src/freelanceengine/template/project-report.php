<?php
/**
 * The template for displaying project report list, form in single project
 */
global $post, $user_ID;
$date_format = get_option('date_format');
$time_format = get_option('time_format');

$query_args = array('type' => 'fre_report', 'post_id' => $post->ID , 'paginate' => 'load', 'order' => 'DESC', 'orderby' => 'date' );
/**
 * count all reivews
*/
$total_args = $query_args;
$all_cmts   = get_comments( $total_args );

/**
 * get page 1 reviews
*/
$query_args['number'] = 10;//get_option('posts_per_page');
$comments = get_comments( $query_args );

$total_messages = count($all_cmts);
$comment_pages  =   ceil( $total_messages/$query_args['number'] );
$query_args['total'] = $comment_pages;
$query_args['text'] = __("Load older message", ET_DOMAIN);

$messagedata = array();
$message_object = new Fre_Report('fre_report');

?>
<div class="project-workplace-details report-details">
    <div class="row">
        <div class="col-md-4 col-md-push-8 col-xs-12 workplace-project-details dispute">
            <?php
                if($post->post_status == 'disputing'){
                    $project_report_by = get_post_meta($post->ID, 'dispute_by', true);
                    if(ae_user_role($project_report_by) == FREELANCER) {
                        $reporter = $project_report_by;
                        $reporter_name = "<strong>".sprintf(__('Freelancer %s', ET_DOMAIN), get_the_author_meta( 'display_name', $reporter )) ."</strong>";
                    } else {
                        $reporter = $post->post_author;
                        $reporter_name = "<strong>".sprintf(__('Employer %s', ET_DOMAIN), get_the_author_meta( 'display_name', $reporter )) ."</strong>";
                    }
                    
            ?>
                <div class="project-report-quit">
                    <p>
                        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                        <?php printf(__('%s has quit this project. The final result of the dispute will be decided based on reports and proofs from both sides. Email, images, contracts, files, etc. are accepted.', ET_DOMAIN), $reporter_name)?>
                    </p>
                    <?php if(current_user_can( 'manage_options' )){ 
                            $bid_accepted = get_post_meta($post->ID, 'accepted', true);
                            $bid_owner = get_post_field('post_author', $bid_accepted);
                            $freelancer = '<a href="'.get_author_posts_url($bid_owner).'">'.get_the_author_meta('display_name', $bid_owner).'</a>';
                            $employer = '<a href="'.get_author_posts_url($post->post_author).'">'.get_the_author_meta('display_name', $post->post_author).'</a>';
                    ?> 
                        <p>
                            <?php _e('Below is related parites of the disputed:', ET_DOMAIN);?> </br>
                            <?php printf(__('Employer %s', ET_DOMAIN), $employer);?> </br>
                            <?php printf(__('Freelancer %s', ET_DOMAIN), $freelancer);?>
                        </p>
                    <?php } ?>
                    <?php
                        if(fre_access_workspace($post)){
                            $project_link = get_permalink( $post->ID );
                            echo "<p>".__('In case you need some proofs from workspace, please click on the link below.', ET_DOMAIN)."</p>";
                            echo '<a class="workspace-link" href="'.add_query_arg(array('workspace' => 1), $project_link).'">'.__("Open workspace >", ET_DOMAIN).'</a>';
                        }
                     ?>
                </div>
            <?php } ?>
            <?php if($post->post_status == 'disputed'){
                $comment_of_admin = get_post_meta($post->ID, 'comment_of_admin', true);
                $winner_of_arbitrate = get_post_meta($post->ID, 'winner_of_arbitrate', true);
            ?>
                <!-- admin report after arbitrate -->
                <div class="project-report-arbitrate">
                    <?php if($comment_of_admin || $winner_of_arbitrate){ ?>
                        <p>
                            <?php if($comment_of_admin){ ?>
                                <i class="fa fa-info-circle" aria-hidden="true"></i>
                                <strong><?php _e("Admin's decision", ET_DOMAIN);?>:</strong> <?php echo $comment_of_admin; ?>
                            <?php } ?>
                        </p>
                        <p>
                            <?php 
                                if($winner_of_arbitrate){
                                    if($winner_of_arbitrate == 'freelancer'){
                                        $bid_accepted = get_post_meta($post->ID, 'accepted', true);
                                        $bid_owner = get_post_field('post_author', $bid_accepted);
                                        $freelancer = get_the_author_meta('display_name', $bid_owner);
                                        printf(__('%s wins the dispute', ET_DOMAIN), ' <strong>'.$freelancer.'</strong>');
                                    }else{
                                        $employer = get_the_author_meta('display_name', $post->post_author);
                                        printf(__('%s wins the dispute', ET_DOMAIN), ' <strong>'.$employer.'</strong>');
                                    }
                                }
                            ?>
                        </p>
                    <?php }else{ ?>
                        <p>
                            <?php  
                                if(current_user_can( 'manage_options' )){
                                    _e('This project was resolved.', ET_DOMAIN);
                                }else{
                                    _e('This project was resolved by admin.', ET_DOMAIN);    
                                }
                            ?>
                        </p>
                    <?php } ?>
                    <?php
                        if(fre_access_workspace($post)){
                            $project_link = get_permalink( $post->ID );
                            echo '<p>'.__('In case you need to take a look at your previous workspace, please click the link below.', ET_DOMAIN).'</p>';
                            echo '<a class="workspace-link" href="'.add_query_arg(array('workspace' => 1), $project_link).'">'.__("Open workspace >", ET_DOMAIN).'</a>';
                        }
                    ?>
                </div>
            <?php } ?>
            <div class="content-require-project">
                <div class="workplace-title">
                    <h4><?php _e('Project description:',ET_DOMAIN);?></h4>
                    <div class="workplace-title-arrow"><span></span></div>
                </div>
                <div class="workplace-project-description">
                    <?php the_content(); ?>
                </div>
            </div>
        </div>
        <div class="col-md-8 col-md-pull-4 col-xs-12 report-container">
            <div class="work-report-wrapper">
                <div class="form-report-wrapper" >
                    <?php if($post->post_status == 'disputing') { ?>
                        <form class="form-group-work-place-wrapper form-report notify-mail">
                            <div class="form-group-work-place work-place-dispute" id="report_docs_container">
                                <span class="et_ajaxnonce" id="<?php echo wp_create_nonce( 'file_et_uploader' ) ?>"></span>
                                <div class="content-report-wrapper">
                                    <div class="text-your-report"><?php _e("Reports", ET_DOMAIN); ?></div>
                                    <div class="fre-input-field form-group">
                                        <textarea name="comment_content" class="content-chat" placeholder="<?php _e('Type your report here', ET_DOMAIN)?>"></textarea>
                                    </div>
                                    <div class="form-group form-submit-notify">
                                        <a href="#" class="attach-file-button pull-left" id="report_docs_browse_button">
                                            <i class="fa fa-plus-circle"></i><?php _e("Attachments", ET_DOMAIN); ?>
                                        </a>
                                        <input type="submit" name="submit" value="<?php _e( "Send" , ET_DOMAIN ); ?>" class="fre-small-btn submit-chat-content">
                                        <input type="hidden" name="comment_post_ID" value="<?php echo $post->ID; ?>" />
                                    </div>
                                </div>
                                <div class="file-attachment-wrapper">
                                    <ul class="file-attack-report apply_docs_file_list" id="apply_docs_file_list">
                                        <!-- report file list -->
                                    </ul>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </form>
                    <?php }else{ ?>
                    <div class="text-your-report-resolved"><?php _e("Reports", ET_DOMAIN); ?></div>
                    <?php }?>
                </div>
                <ul class="list-chat-work-place-dispute">
                    <?php
                    foreach ($comments as $key => $message) {
                        $convert = $message_object->convert($message);
                        $messagedata[] = $convert;
                        $display_name = get_the_author_meta( 'display_name', $message->user_id );
                    ?>
                    <li class="message-item" id="comment-<?php echo $message->comment_ID; ?>">
                        <div class="form-group-work-place">
                            <div class="info-avatar-report">
                                <a href="#" class="avatar-employer-report">
                                    <?php echo $message->avatar; ?>
                                </a>
                                <div class="info-report">
                                    <span class="name-report"><?php printf(__("%s's report", ET_DOMAIN), $display_name); ?></span>
                                    <div class="date-chat-report">
                                        <?php echo $message->message_time; ?>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <div class="content-report-wrapper">
                                <div class="content-report">
                                    <?php echo $convert->comment_content; ?>
                                </div>
                                <?php
                                    if( $convert->file_list) { 
                                        echo $convert->file_list;
                                    }
                                ?>
                            </div>
                        </div>
                    </li>
                    <?php } ?>
                </ul>
                <?php if($comment_pages > 1) { ?>
                    <div class="paginations-wrapper" >
                        <?php ae_comments_pagination( $comment_pages, $paged ,$query_args );   ?>
                    </div>
                <?php } ?>
                <?php echo '<script type="json/data" class="postdata" > ' . json_encode($messagedata) . '</script>'; ?>
            </div>
        </div>
        
    </div>
</div>
