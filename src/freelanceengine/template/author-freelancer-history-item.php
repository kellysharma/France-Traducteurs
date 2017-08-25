<?php
/**
 * the template for displaying the freelancer work (bid success a project)
 # this template is loaded in template/bid-history-list.php
 * @since 1.0
 * @package FreelanceEngine
 */
$author_id = get_query_var('author');
global $wp_query, $ae_post_factory, $post;

$post_object = $ae_post_factory->get(BID);

$current     = $post_object->current_post;

if(!$current || !isset( $current->project_title )){
    return;
}
?>

<li class="bid-item">
    <div class="name-history">
        <a href="<?php echo get_author_posts_url( $current->post_author ); ?>">
            <span class="avatar-bid-item"><?php echo $current->project_author_avatar;?></span>
        </a>
        <div class="content-bid-item-history">
            <h5><a href = "<?php echo $current->project_link; ?>"><?php echo $current->project_title; ?></a>
            </h5>
        </div>
        <div class="content-complete">
            <div class="rate-it" data-score="<?php echo $current->rating_score; ?>"></div>
            <?php if(isset($current->project_comment) && !empty($current->project_comment)){ ?>
                <div class="comment-author-history full-text">
                    <p><?php echo $current->project_comment;?></p>
                </div>
            <?php } ?>
        </div>
    </div>
    <ul class="info-history action-project">
        <li class="date"><?php printf(__('Worked on %s', ET_DOMAIN), $current->project_post_date);?></li>
    </ul>
    <div class="clearfix"></div>
</li>
