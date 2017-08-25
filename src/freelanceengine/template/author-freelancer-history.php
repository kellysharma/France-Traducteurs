<?php
/**
 * Template part for user bid history block
 # This template is loaded in page-profile.php , author.php
 * @since v1.0
 * @package EngineTheme
 */
?>
<div class="profile-history freelancer-project-history">
<?php
global $user_bids;
$author_id = get_query_var('author');
$is_author = is_author();
add_filter('posts_orderby', 'fre_reset_order_by_project_status');
add_filter('posts_where', 'fre_filter_where_bid');
query_posts( array(  'post_status' => array('complete'), 'post_type' => BID, 'author' => $author_id, 'accepted' => 1 , 'filter_work_history' => '' , 'is_author' => $is_author));
$bid_posts   = $wp_query->found_posts;
    
global $wp_query, $ae_post_factory;
$author_id = get_query_var('author');

$post_object = $ae_post_factory->get(BID);

?>
<div class="inner">
    <h4 class="title-big-info-project-items"><?php printf(__("Work History (%d)", ET_DOMAIN), $wp_query->found_posts) ?></h4>
</div>
<ul class="list-work-history-profile">
    <?php
        $postdata = array();
        if(have_posts()):
            while (have_posts()) { the_post();
                $convert = $post_object->convert($post,'thumbnail');
                $postdata[] = $convert;
                get_template_part( 'template/author-freelancer-history', 'item' );
            }
        else:
            _e('<span class="no-results">There are no activities yet.</span>',ET_DOMAIN);
        endif;
    ?>
</ul>
<?php
    /* render post data for js */
    echo '<script type="data/json" class="postdata" >'.json_encode($postdata).'</script>';
?>
<!-- pagination -->
<?php
    $wp_query->query = array_merge(  $wp_query->query  ) ;   
    echo '<div class="paginations-wrapper">';
    ae_pagination($wp_query, get_query_var('paged'), 'page');
    echo '</div>';
    remove_filter('posts_where', 'fre_filter_where_bid');
    remove_filter('posts_orderby', 'fre_reset_order_by_project_status');
?>
</div>