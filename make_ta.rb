#!/usr/bin/env ruby
#
urls = [
  'https://docs.google.com/forms/d/1Q3GaVGjJzuSZTjkS2xTEh9_msB-4HGQjiEDRXogsDhA/viewform',
  'https://docs.google.com/forms/d/1bDq1tjJLmOrHrRxjO4drVW_bJVYa1Noh31EfEK5fkUA/viewform',
  'https://docs.google.com/forms/d/1GsG21O9TYo0tomJK1gcIlh3IGQnBxdP3UInu-QMCQa4/viewform',
  'https://docs.google.com/forms/d/10XZFsgdu7wRPXQnG3Dsupoh0kQuBjd_15Xo91aCpyUU/viewform',
  'https://docs.google.com/forms/d/1vvJBlXK4xal0LJmMAM3Qei0ebyni1PfoV5U5u-LFEno/viewform',
  'https://docs.google.com/forms/d/1W2xt5F1QVtjVSeFxPhSIqe2xSy5_v5caOhYHZCwDEZY/viewform',
  'https://docs.google.com/forms/d/1c4pEALl1NZn9Gr3ZG3ENoBsQ6bdFs1d_UIoK4No8Ulc/viewform',
  'https://docs.google.com/forms/d/1fO2zpzEBD0YCC4s0TxqYziN2jAtrN4zc5FmYKsss-vQ/viewform'
]
system "rm -rf tmp_app"
system "rm -rf ta*/idforweb.apk ta*/idforweb.zip"
unzip_dir = 'tmp_app'
Dir.mkdir(unzip_dir) unless Dir.exists? unzip_dir
system "cp idforweb.apk #{unzip_dir}; cd #{unzip_dir}; unzip idforweb.apk; rm idforweb.apk; rm -rf META-INF"
idx = 0
urls.each do |x|
  # mkdir ta[num]
  dir_name = "ta#{idx}"
  Dir.mkdir(dir_name) unless Dir.exists? dir_name
  # copy *.js, *.html into that dir
  system "cp *.js *.html *.gif *.mp4 #{dir_name}"
  # create survey_url.js
  File.open("#{dir_name}/survey_url.js", 'w') do |f|
    f.puts("var survey_url = '#{x}';")
  end

  # overwrite survey_url
  f = File.open("#{unzip_dir}/assets/surveyURL", 'w')
  f.puts(x)
  f.close
  # zip again
  system "cd #{unzip_dir}; zip -r ../ta#{idx}/idforweb.zip *; " +
    "jarsigner -keystore ../app.keystore -storepass 12121212 -keypass 12121212 -signedjar ../ta#{idx}/idforweb.apk ../ta#{idx}/idforweb.zip gtisc"
  idx += 1
end
