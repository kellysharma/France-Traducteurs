<?php
/**
 * Template part for employer posted project block
 # this template is loaded in page-profile.php , author.php
 * @since 1.0
 * @package FreelanceEngine
 */
    $status = array(
        'publish'   => __("ACTIVE", ET_DOMAIN),
        'complete'  => __("COMPLETED", ET_DOMAIN)
    );


?>
<div class="profile-history employer-project-history no-margin-top">
<?php
$is_author = is_author();
$author_id = get_query_var('author');
$stat = array('publish','complete');

$query_args = array('is_author' => true,
                    'post_status' => $stat,
                    'post_type' => PROJECT,
                    'author' => $author_id,
                    'order' => 'DESC',
                    'orderby' => 'date');

// filter order post by status
add_filter('posts_orderby', 'fre_order_by_project_status');
query_posts( $query_args);
// remove filter order post by status
$bid_posts   = $wp_query->found_posts;
?>
<div class="info-project-items-employer">
    <div class="inner">
        <h4 class="title-big-info-project-items">
            <?php printf(__("Project History & Review (%d)", ET_DOMAIN), $wp_query->found_posts); ?>
        </h4>
        <?php if(have_posts()):?>
        <div class="filter-project filter-project-employer">
            <div class="filter-area">
                <select class="status-filter chosen-select" name="post_status" data-chosen-width="100%" data-chosen-disable-search="1"
                        data-placeholder="<?php _e("Filter by project's status", ET_DOMAIN); ?>">
                    <option value=""><?php _e("Filter by project's status", ET_DOMAIN); ?></option>
                    <option value="publish"><?php _e("ACTIVE", ET_DOMAIN); ?></option>
                    <option value="complete"><?php _e("COMPLETED", ET_DOMAIN); ?></option>
                </select>
            </div>
        </div>
        <?php endif; ?>
        <div class="clearfix"></div>
    </div>
    <?php
        // list portfolio
        if(have_posts()):
            global $wp_query, $ae_post_factory;
            $author_id = get_query_var('author');

            $post_object = $ae_post_factory->get(PROJECT);
            ?>
            <ul class="list-work-history-profile">
                <?php
                $postdata = array();
                while (have_posts()) { the_post();
                    $convert    = $post_object->convert($post,'thumbnail');
                    $postdata[] = $convert;
                    get_template_part( 'template/author', 'employer-history-item' );
                }
                ?>
            </ul>
            <?php
            
            /**
             * render post data for js
            */
            echo '<script type="data/json" class="postdata" >'.json_encode($postdata).'</script>';
            // get_template_part( 'template/work', 'history-list' );
            // global $wp_query;
            // $wp_query->query = array_merge(  $wp_query->query ,array('is_author' => $is_author)) ;
            echo '<div class="paginations-wrapper">';
            ae_pagination($wp_query, get_query_var('paged'), 'page');
            echo '</div>';
        else :
            _e("<span class='no-results'>There are no projects found.</span>", ET_DOMAIN);
        endif;
        //wp_reset_postdata();
     ?>

    </div>
</div>
<?php
wp_reset_query();
remove_filter('posts_orderby', 'fre_order_by_project_status');