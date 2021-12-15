import json
import datetime
import boto3
import os
import base64

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    
    print(event)
    print(event.keys())
    print("event[body]:",  event["body"])
    
    body = json.loads(event["body"]) # str -> dict
    print("type of event[body]:", type(event["body"]))
    print("type of body:", body)
    content = body["text"]
    print("content:", content)
    text64 = content.split(",")[1]
    print("text64:", text64)
    text_byte = base64.b64decode(b'44GT44KT44Gr44Gh44Gv') #byteデータに変換
    print("text_byte:", text_byte)
    text_raw = text_byte.decode() #Byteデータをデコード
    print("text_raw:", text_raw)

    filename     = datetime.datetime.now().strftime('%Y%m%d_%H%M%S') + ".txt"
    tmp_filename = "/tmp/" + filename
    bucket_name  = "test-bucket-5858"
    with open(tmp_filename, "w") as f:
        f.write(text_raw)
   
    print(os.listdir("/tmp/"))
        
    try: 
        s3.upload_file(tmp_filename, bucket_name, filename)
    
        return {
            'statusCode': 200,
            "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": '*',
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                       },
            'body': json.dumps('Hello from Lambda!')
        }
    except :
        return {
            "errorType" : "InternalServerError",
            'statusCode': 500,
            "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": '*',
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                       },
            'body': json.dumps('Lambda failed')
        }