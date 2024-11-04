# -*- coding: utf-8 -*-
from datetime import date, datetime, timedelta
import pytz

tz_NY = pytz.timezone('Asia/Kolkata')

def datetime_now():
  datetime_NY = datetime.now(tz_NY).isoformat()[:-9] + 'Z'
  return datetime_NY

def get_expiry_datetime():
  datetime_NY = (datetime.now(tz_NY) + timedelta(days=1825)).isoformat()[:-9] + 'Z'
  return datetime_NY

def default(o):
  if isinstance(o, (date, datetime)):
    return o.isoformat()[:-9] + 'Z'
