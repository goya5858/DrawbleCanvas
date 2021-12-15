import json
import datetime
import boto3
import os
import sys
import base64
import numpy as np
import cv2

def lambda_handler(event, context):
    #filename  = datetime.datetime.now().strftime('%Y%m%d_%H%M%S') + ".txt"
    filename  = datetime.datetime.now().strftime('%Y%m%d_%H%M%S') + ".jpg"
    tmp_filename = "/tmp/" + filename
    bucket_name  = "test-bucket-5858"

    s3 = boto3.client("s3")
    
    #print(event)
    print("event-keys: ", event.keys())
    #print("event[body]:",  event["body"])
    
    body = json.loads(event["body"]) # str -> dict
    print("type of event[body]:", type(event["body"]))
    #print("body:", body)

    content = body["text"]
    print("size of content:", sys.getsizeof(body["text"]))
    #print("content:", content)

    text64 = content.split(",")[1] #Base64のテキストデータの必要部分だけ取り出し
    #print("text64:", text64)

    text_byte = base64.b64decode(text64) #byteデータに変換
    #print("text_byte:", text_byte)
    print("success convert to Byte_data")

    ##### TEXTデータではこっちを使用 ######
        #text_raw = text_byte.decode() #Byteデータをデコード
        ##print("text_raw:", text_raw)
    
    jpg=np.frombuffer(text_byte,dtype=np.uint8)
    print("success convert to numpy array")
    #print(jpg)
    img = cv2.imdecode(jpg, cv2.IMREAD_COLOR)
    print("success convert to IMG by imdecode")

    #with open(tmp_filename, "w") as f:
    #    f.write(text_raw)
    cv2.imwrite(tmp_filename,img) # jpgファイルの保存
    print("success img save to /tmp/")
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