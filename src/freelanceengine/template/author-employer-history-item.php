<?php
/**
 * Template part for employer project details
 # this template is loaded in template/list-work-history.php
 * @since 1.0
 * @package FreelanceEngine
 */
global $user_ID;
$author_id = get_query_var('author');

global $wp_query, $ae_post_factory, $post;

$post_object = $ae_post_factory->get( PROJECT );
$current     = $post_object->current_post;

if(!$current){
    return;
}
?>
<li class="bid-item">
    <div class="name-history">
        <a href="<?php echo $current->author_url ?>">
            <span class="avatar-bid-item"><?php echo $current->et_avatar;?></span>
        </a>
        <div class="content-bid-item-history">
            <h5><a href = "<?php echo $current->permalink; ?>"><?php echo $current->post_title; ?></a>
            </h5>
        </div>
        <div class="content-complete">
            <?php 
                switch ($current->post_status) {
                    case 'publish':
                        echo '<span class="stt-in-process">';
                            _e('Project is currently available for bidders', ET_DOMAIN);
                        echo '</span>';
                        printf(__('Budget: %s', ET_DOMAIN), $current->budget);
                        break;
                    case 'complete':
                        echo '<span class="stt-in-process">';
                            _e('Project is already completed', ET_DOMAIN);
                        echo '</span>';
                        if(isset($current->project_comment) && !empty($current->project_comment)){
                        ?>
                            <div class="review-rate">
                                <div class="rate-it" data-score="<?php echo $current->rating_score ; ?>"></div>
                            </div>
                            <div class="comment-author-history full-text">
                                <p><?php echo $current->project_comment;?></p>
                            </div>
                        <?php 
                        } 
                        break;
                }
            ?>
        </div>
    </div>
    <ul class="info-history action-project">
        <li class="date"><?php printf(__('Published on %s', ET_DOMAIN), $current->post_date);?></li>
    </ul>
    <div class="clearfix"></div>
</li>
