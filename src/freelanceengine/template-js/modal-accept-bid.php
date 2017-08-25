<div class="modal fade" id="acceptance_project" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<i class="fa fa-times"></i>
				</button>
				<h4 class="modal-title">
					<?php _e("Bid acceptance confirmation", ET_DOMAIN) ?>
				</h4>
			</div>
			<div class="modal-body">
				<form role="form" id="escrow_bid" class="">
					<div class="escrow-info">
		            	<!-- bid info content here -->
	                </div>
	                
	            </form>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog login -->
</div><!-- /.modal -->
<!-- MODAL BID acceptance PROJECT-->
<script type="text/template" id="bid-info-template">
	<p class="info-bid-acceptance">
		<?php _e( 'You are about to accept this bid for' , ET_DOMAIN ); ?> <strong class="text-green-dark">{{=budget}}</strong>
		<span>
			<?php _e( 'This bid acceptance requires the payment below' , ET_DOMAIN ); ?>
		</span>
	</p>
	<div class="detail-bid-acceptance">
		<p class="text-credit-small">
			<span class="info-bid"><?php _e( 'Bid budget' , ET_DOMAIN ); ?></span>
			<strong>{{= budget }}</strong>
		</p>
		<# if(commission){ #>
		<p class="text-credit-small">
			<span class="info-bid"><?php _e( 'Commission' , ET_DOMAIN ); ?></span>
			<strong>{{= commission }}</strong>
		</p>
		<# } #>
	</div>
	<div class="total-amount">
		<p class="text-credit-small"><span class="info-bid"><?php _e( 'Total amount' , ET_DOMAIN ); ?></span>
			<strong class="text-green-dark">{{=total}}</strong>
		</p>
	</div>
	<?php 
	if(ae_get_option('user_credit_system') && class_exists('FRE_Credit')):
        if( is_use_credit_escrow()):
	?>
		<div class="info-credit-balance">
			<?php _e("Your credit balance: ", ET_DOMAIN);?><strong class="credit-balance">{{= available_balance}}</strong>
			<p class="notice_credit"></p>
		</div>
	<?php 
		endif; 
	endif;
	?>
	<?php  do_action('fre_after_accept_bid_infor'); ?>
	<# if(accept_bid){ #>

        <button type="submit" class="fre-btn">
            <?php _e('Accept Bid', ET_DOMAIN) ?>
        </button>

	<# }else{ #>
		<div class="form-group">
			<a class="fre-btn btn-buy-credit" href="#"><?php _e("Buy credit", ET_DOMAIN);?></a>
	    </div>
	<# } #>
</script>