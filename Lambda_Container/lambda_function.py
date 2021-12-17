import json
import datetime
import boto3
import os
import sys
import base64
import numpy as np
import cv2

def lambda_handler(event, context):
    print("event-keys: ", event.keys())
    filename  = datetime.datetime.now().strftime('%Y%m%d_%H%M%S') + ".jpg"
    tmp_filename = "/tmp/" + filename
    bucket_name  = "test-bucket-5858"

    s3 = boto3.client("s3")
    
    ### 送信されたデータの画像データへの読み込み ###
    body = json.loads(event["body"]) # str -> dict
    print("type of event[body]:", type(event["body"]))

    content = body["text"] # 送信時に"text"にデータを挿入しているため
    print("size of content:", sys.getsizeof(body["text"]))

    text64 = content.split(",")[1] #Base64のテキストデータの必要部分だけ取り出し
    print("num of base64-sep is", len(content.split(",")))

    text_byte = base64.b64decode(text64) #byteデータに変換
    print("success convert to Byte_data")
    
    jpg=np.frombuffer(text_byte,dtype=np.uint8)
    print("success convert to numpy array")

    img = cv2.imdecode(jpg, cv2.IMREAD_COLOR)
    print("success convert to IMG by imdecode")
    print("type of img:", type(img))

    ### 読み込まれた画像データの保存 ###
    cv2.imwrite(tmp_filename,img) 
    print("success save img to /tmp/")
    print(os.listdir("/tmp/"))
    
    ### 画像データのBase64(str)へのエンコード ###
    encode_parms  = [int(cv2.IMWRITE_WEBP_QUALITY), 50]
    ret, encode_img = cv2.imencode('.webp', img, encode_parms)
    print("encode img")
    print("type of ret & enimg:", type(ret), type(encode_img) )

    body = base64.b64encode(encode_img).decode('utf-8')
    print("Encode return IMG")
    print("type of body:", type(body))

    try: 
        # S3へ画像のアップロード
        s3.upload_file(tmp_filename, bucket_name, filename)
    
        return {
            'statusCode': 200,
            "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": '*',
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                    "Content-Type": "image/*"
                       },
            'body': body,
            'isBase64Encoded': True
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