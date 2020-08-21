.PHONY: setup-local

setup-local:
	@echo 'Setting up Python virtual environment'
	@python3 -m pip install --user virtualenv
	@python3 -m venv ~/.venv/nibble
	@python3 -m pip install -r requirements.txt
	@python3 -m pip install -e ./ops/nibble_tools
	# @ssh-keygen -P "" -t rsa -b 4096 -m PEM -f ~/.ssh/dev-ssh_key_pair
	# @cp ~/.ssh/dev-ssh_key_pair ~/.ssh/dev-ssh_key_pair.pem
	# @chmod 400 ~/.ssh/dev-ssh_key_pair.pem
	# @aws configure --profile nibble
