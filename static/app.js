let timer;

$('#begin').on('click', function(e) {
  $('#submit_word').prop('disabled', false);
  timer = setTimeout(async () => {
    $('#gameover').css('display', 'block');
    $('#submit_word').prop('disabled', true);
    response = await axios.post('/stats', {"score": "0"});
    $('#games_played').text(response.data.games_played);
    resp = await axios.post('/clear_dupes');
  }, 15000);
});

$('#submit_word').on('click', async function(e) {
    e.preventDefault();
    response = await axios.post('/word', {"word": $('#form_word').val()});
    if (response.data.result === 'ok') {
        const score = ($('#form_word').val()).length + parseInt($('#score').text());
        $('#score').text(score);
    }

    $('#result_text').text($('#form_word').val() + ' = ' + response.data.result)
    $('#form_word').val('')
    clearTimeout(timer);
    timer = setTimeout(async () => {
        $('#gameover').css('display', 'block');
        $('#submit_word').prop('disabled', true);
        response = await axios.post('/stats', {"score": $('#score').text()});
        $('#games_played').text(response.data.games_played);
        $('#high_score').text(response.data.high_score);

        //clear list of guessed words for subsequent games
        const resp = axios.post('/clear_dupes');
        setTimeout(() => {
          window.location.replace('http://localhost:5000');
        }, 2000);
      }, 15000);
});