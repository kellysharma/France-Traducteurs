<div class="modal fade" id="modal_transfer_money">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<i class="fa fa-times"></i>
				</button>
				<h4 class="modal-title"><?php _e("Transfer Money", ET_DOMAIN) ?></h4>
			</div>
			<div class="modal-body">
				<form role="form" id="transfer-money-form" class="transfer-money-form">
					<div class="form-group">
					</div>
                    <div class="clearfix"></div>
					<button type="submit" class="fre-btn btn-submit">
						<?php _e('Transfer', ET_DOMAIN) ?>
					</button>
				</form>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog login -->
</div><!-- /.modal -->
<script type="text/template" id="transfer_money_info_template">
		<p>{{= message}}</p>
		<div class="transfer-money">
			<span><?php _e('Bid budget', ET_DOMAIN);?></span>
			<span>{{= bid_budget}}</span>
		</div>
		<div class="transfer-money">
			<span><?php _e('Commision fee', ET_DOMAIN);?></span>
			<span>{{= commission_fee}}</span>
		</div>
		<div class="transfer-money">
			<span><?php _e('Transfered amount', ET_DOMAIN);?></span>
			<span class="text-green-dark">{{= amount}}</span>
		</div>
</script>