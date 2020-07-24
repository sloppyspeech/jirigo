export FLASK_APP=jirigo_engine.py
export FLASK_RUN_PORT=9001
. ./ev_jirigo/bin/activate
# flask run --host 192.168.1.5
flask run --host 0.0.0.0
