<?php
global $post, $user_ID;
$bid = get_post_meta( $post->ID, 'accepted', true );
$bid_author = get_post_field( 'post_author', $bid );
$bid_budget = get_post_meta( $bid, 'bid_budget', true );
$bid_author_name = get_the_author_meta( 'display_name', $bid_author );
$payer_of_commission = ae_get_option('payer_of_commission', 'project_owner');
$use_escrow = ae_get_option('use_escrow');
if($payer_of_commission == 'project_owner' && $use_escrow && $post->post_author == $user_ID){
    $commission_fee = get_post_meta($bid,'commission_fee',true);
    if(!$commission_fee){
        // get commission settings
        $commission = ae_get_option('commission', 0);
        $commission_fee = $commission;
        // caculate commission fee by percent
        $commission_type = ae_get_option('commission_type');
        if ($commission_type != 'currency') {
            $commission_fee = ((float)($bid_budget * (float)$commission)) / 100;
        }
    }
    $bid_budget = (float)$bid_budget + (float)$commission_fee;
}
?>
<!-- MODAL FINISH PROJECT-->
<div class="modal fade" id="modal_review" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<i class="fa fa-times"></i>
				</button>
				<h4 class="modal-title"><?php _e("Congratulation!", ET_DOMAIN) ?></h4>
			</div>
			<div class="modal-body">
				<form role="form" id="review_form" class="review-form">
				<?php if($post->post_author == $user_ID) {  // employer finish project form ?>
					<input type="hidden" name="action" value="ae-employer-review" />
	            	<label style="line-height:2.2;" class="label-text">
						<?php _e("You are going to finish this project. Now it’s time for you to review and rate for freelancer.", ET_DOMAIN) ?>
					</label>
					<div class="modal-body-line"></div>
					<label style="line-height:2.2;" class="label-text">
						<?php _e("The freelancer will get reputattion if you give him rating & review.", ET_DOMAIN); ?>
					</label>
					
	                <div class="form-group">
	                    <div class="rating-it" style="cursor: pointer;"> <input type="hidden" name="score" > </div>
					</div>
					<div class="fre-input-field form-group">
						<textarea name="comment_content" placeholder="<?php _e('You review here', ET_DOMAIN);?>"></textarea>
					</div>
	                <div class="form-group">
	                    <button type="submit" class="fre-btn">
							<?php _e('Finish', ET_DOMAIN) ?>
	                    </button>
					</div>
				 <?php }else { // freelancer finish project form
				 	$employer_name = get_the_author_meta( 'display_name', $post->post_author );
				  ?>
					
					<!--Commission fee-->
					<input type="hidden" name="action" value="ae-freelancer-review" />
					<label style="line-height:2.2;" class="label-text">
						<?php _e("Congragulation on completing the project. Employer has been finished the project. Also, please check your personal account to make sure the money is successfully transferred.", ET_DOMAIN) ?>
					</label>
					<div class="modal-body-line"></div>
					<label style="line-height:2.2;" class="label-text">
						<?php _e("You can also give rating & review for the employer.", ET_DOMAIN); ?>
					</label>
					<div class="form-group">
	                    <div class="rating-it" style="cursor: pointer;"> <input type="hidden" name="score" > </div>
					</div>
					<div class="fre-input-field form-group">
						<textarea name="comment_content" placeholder="<?php _e('You review here', ET_DOMAIN);?>"></textarea>
					</div>
	                <div class="form-group">
	                    <button type="submit" class="fre-btn">
							<?php _e('Finish', ET_DOMAIN) ?>
	                    </button>
					</div>
					<?php } ?>
				</form>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog login -->
</div><!-- /.modal -->
<!-- MODAL FINISH PROJECT-->