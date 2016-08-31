#!/bin/bash
#Using bash script to run osascript because applescript do not print to stdout
WINDOW=`osascript $1`
SSID=`/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'`
IP=`dig +short myip.opendns.com @resolver1.opendns.com`
echo "$WINDOW, $SSID, $IP"
