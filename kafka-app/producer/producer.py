from kafka import KafkaProducer
from flask import Flask, request, render_template

topic = 'msk-topic'

producer = KafkaProducer(bootstrap_servers=[
                         'b-1.erdenaymks.dibkfn.c13.kafka.us-east-1.amazonaws.com:9092', 'b-2.erdenaymks.dibkfn.c13.kafka.us-east-1.amazonaws.com:9092'])

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        key = request.form.get('key')
        value = request.form.get('value')
        producer.send(topic, key=key.encode(), value=value.encode())
        producer.flush()
        print(f"Message '{value}' with key '{key}' sent to Kafka")
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3001)