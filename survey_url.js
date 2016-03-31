var survey_urls = [
  "https://docs.google.com/forms/d/1Q3GaVGjJzuSZTjkS2xTEh9_msB-4HGQjiEDRXogsDhA/viewform",
  "https://docs.google.com/forms/d/1bDq1tjJLmOrHrRxjO4drVW_bJVYa1Noh31EfEK5fkUA/viewform",
  "https://docs.google.com/forms/d/1GsG21O9TYo0tomJK1gcIlh3IGQnBxdP3UInu-QMCQa4/viewform",
  "https://docs.google.com/forms/d/10XZFsgdu7wRPXQnG3Dsupoh0kQuBjd_15Xo91aCpyUU/viewform",
  "https://docs.google.com/forms/d/1vvJBlXK4xal0LJmMAM3Qei0ebyni1PfoV5U5u-LFEno/viewform",
  "https://docs.google.com/forms/d/1W2xt5F1QVtjVSeFxPhSIqe2xSy5_v5caOhYHZCwDEZY/viewform",
  "https://docs.google.com/forms/d/1c4pEALl1NZn9Gr3ZG3ENoBsQ6bdFs1d_UIoK4No8Ulc/viewform",
  "https://docs.google.com/forms/d/1fO2zpzEBD0YCC4s0TxqYziN2jAtrN4zc5FmYKsss-vQ/viewform"
];

function retrieve_survey_url() {
  var int_gtid = (localStorage['gtid'] | 0);
  return survey_urls[int_gtid % survey_urls.length];
}
