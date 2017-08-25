<div class="modal fade" id="modal_arbitrate">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<i class="fa fa-times"></i>
				</button>
				<h4 class="modal-title"><?php _e("Resolve Dispute", ET_DOMAIN) ?></h4>
			</div>
			<div class="modal-body">
				<form role="form" id="arbitrate_form" class="arbitrate-form">
					<div class="form-group fre-input-field">
						<p style="line-height: 2.2"><?php _e('You are about to resolve this dispute. You can send your comment and transfer money to the winner.', ET_DOMAIN);?></p>
						<textarea name="comment_resolved" placeholder="<?php _e('Your commment here', ET_DOMAIN);?>"></textarea>
					</div>
					<div class="form-group form-group-choose-transfer-money">
						<p><?php _e('Choose who you want to transfer money to', ET_DOMAIN);?>:</p>
						<p>
							<label class="radio-inline" for="arbitrate-freelancer">
								<input id="arbitrate-freelancer" type="radio" name="transfer_select" value="freelancer" checked><span></span><?php _e('Freelancer', ET_DOMAIN);?>
							</label>
						</p>
						<p>
							<label class="radio-inline" for="arbitrate-employer">
								<input id="arbitrate-employer" type="radio" name="transfer_select" value="employer"><span></span><?php _e('Employer', ET_DOMAIN);?>
							</label>
						</p>
					</div>
                    <div class="clearfix"></div>
                    <div class="form-group">
                    	<button type="submit" class="fre-btn btn-submit">
							<?php _e('Arbitrate', ET_DOMAIN) ?>
						</button>
                    </div>
				</form>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog login -->
</div><!-- /.modal -->
