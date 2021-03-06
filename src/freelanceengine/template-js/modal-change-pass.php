<div class="modal fade" id="modal_change_pass">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<!-- <span aria-hidden="true">&times;</span><span class="sr-only">
					<?php _e("Close", ET_DOMAIN) ?></span> -->
					<i class="fa fa-times"></i>
				</button>
				<h4 class="modal-title"><?php _e("Change your password.", ET_DOMAIN) ?></h4>
			</div>
			<div class="modal-body">
				<form role="form" id="chane_pass_form" class="auth-form chane_pass_form">
					<div class="fre-input-field">
						<label class="fre-field-title" for="old_password"><?php _e('Current Password', ET_DOMAIN) ?></label>
						<input type="password" class="" id="old_password" name="old_password" placeholder="<?php _e('Enter your current password', ET_DOMAIN) ?>">
					</div>
                    <div class="clearfix"></div>
					<div class="fre-input-field">
						<label class="fre-field-title" for="new_password"><?php _e('Your New Password', ET_DOMAIN) ?></label>
						<input type="password" class="form-control" id="new_password" name="new_password" placeholder="<?php _e('Enter your new password', ET_DOMAIN) ?>">
					</div>
                    <div class="clearfix"></div>
					<div class="fre-input-field">
						<label class="fre-field-title" for="renew_password"><?php _e('Retype New Password', ET_DOMAIN) ?></label>
						<input type="password" class="form-control" id="renew_password" name="renew_password" placeholder="<?php _e('Retype your new password', ET_DOMAIN) ?>">
					</div>
                    <div class="clearfix"></div>
					<button type="submit" class="fre-btn btn-submit">
						<?php _e('Change password', ET_DOMAIN) ?>
					</button>
				</form>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->