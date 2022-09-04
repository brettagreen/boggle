class Handler {
  constructor() {
    this.timer = null;
    $('#begin').on('click', this.begin.bind(this));
    $('#submit_word').on('click', this.submitWord.bind(this));
  }

    begin(event) {
      $('#submit_word').prop('disabled', false);
      this.timer = new Timer(event);
    }

    async submitWord(event) {
      event.preventDefault()
      const response = await axios.post('/word', {"word": $('#form_word').val()});
      if (response.data.result === 'ok') {
          const score = ($('#form_word').val()).length + parseInt($('#score').text());
          $('#score').text(score);
      }

      $('#result_text').text($('#form_word').val() + ' = ' + response.data.result)
      $('#form_word').val('')
      clearTimeout(this.timer);
      this.timer = new Timer(event);
    }

}

class Timer {
  constructor(event) {
     return setTimeout(async () => {
      $('#gameover').css('display', 'block');
      $('#submit_word').prop('disabled', true);
      const response = await axios.post('/stats', {"score": "0"});
      $('#games_played').text(response.data.games_played);
      const resp = await axios.post('/clear_dupes');
      setTimeout(() => {
        window.location.replace('http://localhost:5000');
      }, 2000);
    }, 15000);
  }
}

new Handler();