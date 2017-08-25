<?php
    global $user_ID;
    $step = 3;
    $class_active = '';
    $disable_plan = ae_get_option('disable_plan', false);
    if($disable_plan) {
        $step--;
        $class_active = 'active';
    }
    if($user_ID) $step--;
    $post = '';
    $current_skills = '';

?>
<div id="fre-post-project-2 step-post" class="fre-post-project-step step-wrapper step-post <?php echo $class_active;?>">
    <?php
        if(!$disable_plan) {
            if(isset($_REQUEST['id'])) {
                $post = get_post($_REQUEST['id']);
                if($post) {
                    global $ae_post_factory;
                    $post_object = $ae_post_factory->get($post->post_type);
                    $post_convert = $post_object->convert($post);
                    echo '<script type="data/json"  id="edit_postdata">'. json_encode($post_convert) .'</script>';
                }
                //get skills
                $current_skills = get_the_terms( $_REQUEST['id'], 'skill' );
            }
            $total_package = ae_user_get_total_package($user_ID);
    ?>
            <div class="fre-post-project-box">
                <div class="step-change-package show_select_package">
                    <p class="package_title"><?php _e('Your package:', ET_DOMAIN);?> <strong></strong></p>
                    <p class="package_description"></p>
                    <a class="fre-btn-o fre-post-project-previous-btn fre-btn-previous" href="#"><?php _e('Change package', ET_DOMAIN);?></a>
                </div>
                <div class="step-change-package show_had_package" style="display:none;">
                    <p>
                        <?php echo __('Your post(s) left:', ET_DOMAIN); ?>
                        <span class="post-number"><?php printf(__('%s', ET_DOMAIN), $total_package); ?></span>
                    </p>
                    <?php
                        ob_start();
                        ae_user_package_info($user_ID);
                        $package = ob_get_clean();
                        if($package != '') {
                            echo $package;
                        }
                    ?>
                    <p><?php _e('If you want to get more posts, please click on the next button to be redirected to the purchase page.', ET_DOMAIN);?></p>
                    <a class="fre-btn-o fre-post-project-previous-btn fre-btn-previous" href="#"><?php _e('Purchase', ET_DOMAIN);?></a>
                </div>
            </div>
    <?php } ?>
    <div class="fre-post-project-box">
        <form class="post" role="form" class="validateNumVal">
            <div class="step-post-project" id="fre-post-project">
                <h2><?php _e('Your Project Details', ET_DOMAIN);?></h2>

                <div class="fre-input-field">
                    <label class="fre-field-title" for="fre-project-title"><?php _e('Your project title', ET_DOMAIN);?></label>
                    <input class="input-item text-field" id="fre-project-title" type="text" name="post_title">
                </div>

                <div class="fre-input-field">
                    <label class="fre-field-title" for="project-location"><?php _e('Source language', ET_DOMAIN);?></label>
                    <?php
                        ae_tax_dropdown( 'country' ,array(
                                'attr'            => 'data-chosen-width="100%" data-chosen-disable-search="" data-placeholder="'.__("Choose language", ET_DOMAIN).'"',
                                'class'           => 'fre-chosen-single',
                                'hide_empty'      => false,
                                'hierarchical'    => true ,
                                'id'              => 'country',
                                'show_option_all' => __("Choose language", ET_DOMAIN)
                            )
                        );
                    ?>
                </div>

                <div class="fre-input-field">
                    <label class="fre-field-title" for="project_category"><?php _e('Target language(s)', ET_DOMAIN);?></label>
                    <?php
                        $cate_arr = array();
                        if(!empty($post_convert->tax_input['project_category'])){
                            foreach ($post_convert->tax_input['project_category'] as $key => $value) {
                                $cate_arr[] = $value->term_id;
                            };
                        }
                        ae_tax_dropdown( 'project_category' ,
                          array(  'attr' => 'data-chosen-width="100%" data-chosen-disable-search="" multiple data-placeholder="'.sprintf(__("Choose maximum %s target languages", ET_DOMAIN), ae_get_option('max_cat', 5)).'"',
                                  'class' => 'fre-chosen-multi fre-chosen-category',
                                  'hide_empty' => false,
                                  'hierarchical' => true ,
                                  'id' => 'project_category' ,
                                  'show_option_all' => false,
                                  'selected'        => $cate_arr,
                              )
                        );
                    ?>
                </div>

                <div class="fre-input-field">
                    <label class="fre-field-title" for="skill"><?php _e('Type of text', ET_DOMAIN);?></label>
                    <?php
                        $c_skills = array();
                        if(!empty($post_convert->tax_input['skill'])){
                            foreach ($post_convert->tax_input['skill'] as $key => $value) {
                                $c_skills[] = $value->term_id;
                            };
                        }
                        ae_tax_dropdown( 'skill' , array(  'attr' => 'data-chosen-width="100%" data-chosen-disable-search="" multiple data-placeholder="'.sprintf(__("Choose maximum %s skills", ET_DOMAIN), ae_get_option('fre_max_skill', 5)).'"',
                                            'class' => 'fre-chosen-multi fre-chosen-skill required',
                                            'hide_empty' => false,
                                            'hierarchical' => true ,
                                            'id' => 'skill' ,
                                            'show_option_all' => false,
                                            'selected' => $c_skills
                                    )
                        );
                    ?>
                </div>

                <?php
                    // Add hook: add more field
                    echo '<ul class="fre-custom-field">';
                    do_action( 'ae_submit_post_form', PROJECT, $post );
                    echo '</ul>';
                ?>

                  <!--
                    <div class="fre-input-field">
                      <label class="fre-field-title" for="project-budget"><?php _e('Desired price', ET_DOMAIN);?></label>
                        <div class="fre-project-budget" style="padding-left: 0;">
                          <input id="project-budget" type="number" step="5" required type="number" class="input-item text-field is_number numberVal" name="et_budget" min="1">
                          <span style="padding-left: 2px;"><?php echo fre_currency_sign(false);?></span>
                      </div>
                    </div>
                  -->

                    <div class="fre-input-field" id="gallery_place">
                        <label class="fre-field-title" for=""><?php _e('Attachments (optional)', ET_DOMAIN);?></label>
                        <div class="edit-gallery-image" id="gallery_container">
                            <ul class="fre-attached-list gallery-image carousel-list" id="image-list"></ul>
                            <div class="plupload_buttons" id="carousel_container">
                                <label class="img-gallery fre-project-upload-file" id="carousel_browse_button">
                                    <?php _e("Upload Files", ET_DOMAIN); ?>
                                </label>
                            </div>
                            <p class="fre-allow-upload"><?php _e('(Select maximum 5 files in the png, jpg, pdf, zip, xls, or doc format)', ET_DOMAIN);?></p>
                            <span class="et_ajaxnonce" id="<?php echo wp_create_nonce( 'ad_carousels_et_uploader' ); ?>"></span>
                        </div>
                    </div>

                <div class="fre-input-field">
                    <label class="fre-field-title" for="fre-project-describe"><?php _e('Describe what you need done', ET_DOMAIN);?></label>
                    <?php wp_editor( '', 'post_content', ae_editor_settings() );  ?>
                </div>

                <div class="fre-post-project-btn">
                    <button class="fre-btn fre-post-project-next-btn" type="submit"><?php _e("Submit Project", ET_DOMAIN); ?></button>
                </div>
            </div>
        </form>
    </div>
</div>
<!-- Step 3 / End -->
