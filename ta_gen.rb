urls = [
  'https://goo.gl/forms/xhxUZ5GhZp',
  'https://goo.gl/forms/xhxUZ5GhZp#1',
]

idx = 0
urls.each do |x|
  idx += 1
  # mkdir ta[num]
  dir_name = "ta#{idx}"
  Dir.mkdir(dir_name) unless Dir.exists? dir_name
  # copy *.js, *.html into that dir
  system "cp *.js *.html #{dir_name}"
  # create survey_url.js
  File.open("#{dir_name}/survey_url.js", 'w') do |f|
    f.puts("var survey_url = '#{x}';")
  end
end
