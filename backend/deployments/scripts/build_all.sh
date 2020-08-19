NIBBLE_HOME=$(git rev-parse --show-toplevel)
LAMBDA_HOME=$NIBBLE_HOME/backend/lambdas
cd $LAMBDA_HOME

for d in */; do
    cd $LAMBDA_HOME/$d
    make build archive
done