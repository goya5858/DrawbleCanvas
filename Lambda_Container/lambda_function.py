import json
import datetime
import boto3
import os
import sys
import base64
import numpy as np
import cv2

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    
    #print(event)
    print(event.keys())
    print("event[body]:",  event["body"])
    
    body = json.loads(event["body"]) # str -> dict
    print("type of event[body]:", type(event["body"]))
    #print("body:", body)
    content = body["text"]
    print("size of content:", sys.getsizeof(body["text"]))
    #print("content:", content)
    text64 = content.split(",")[1] #Base64のテキストデータ
    #print("text64:", text64)
    text_byte = base64.b64decode(text64) #byteデータに変換
    print("text_byte:", text_byte)

    ##### ここまで動いてる => Byteデータまで変換できてる ######
        #text_raw = text_byte.decode() #Byteデータをデコード
        ##print("text_raw:", text_raw)
    
    jpg=np.frombuffer(text_byte,dtype=np.uint8)
    print(jpg)
    img = cv2.imdecode(jpg, cv2.IMREAD_COLOR)

    filename  = datetime.datetime.now().strftime('%Y%m%d_%H%M%S') + ".jpg"
    tmp_filename = "/tmp/" + filename
    bucket_name  = "test-bucket-5858"
    #with open(tmp_filename, "w") as f:
    #    f.write(text_raw)
    cv2.imwrite(tmp_filename,img) # jpgファイルの保存
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