'use strict';

(() => {
  const svg = document.getElementById('content');
  const hours = document.getElementById('hours').getElementsByTagName('path');
  const minutes = document.getElementById('minutes')
      .getElementsByTagName('path');
  const seconds = document.getElementById('seconds')
      .getElementsByTagName('path');

  const transforms = {
    hours: [],
    minutes: [],
    seconds: []
  };

  function createTransforms(letters, list) {
    for (let i = 0; i < letters.length; i++) {
      const transform = svg.createSVGTransform();
      letters[i].transform.baseVal.appendItem(transform);
      list.push(transform);
    }
  }

  createTransforms(hours, transforms.hours);
  createTransforms(minutes, transforms.minutes);
  createTransforms(seconds, transforms.seconds);

  function translate(transform, value) {
    const old = transform.matrix.e;
    transform.setTranslate(value * (1 / 5) + old * (4 / 5), 0);
  }

  function setHour(i, x) {
    translate(transforms.hours[i], x);
  }

  function setMinute(i, x) {
    translate(transforms.minutes[i], x);
  }

  function setSecond(i, x) {
    translate(transforms.seconds[i], x);
  }

  function reset(h, m, s) {
    for (let i = 0; i < hours.length; i++)
      if (i !== h)
        setHour(i, 0);

    for (let i = 0; i < minutes.length; i++)
      if (i !== m)
        setMinute(i, 0);

    for (let i = 0; i < seconds.length; i++)
      if (i !== s)
        setSecond(i, 0);
  }

  function getX(list, index, value) {
    let adj;

    // First letter can move only forward
    if (index === 0) {
      adj = value / 2;

    // Last letter - only backward
    } else if (index === list.length - 1) {
      adj = -value / 2;
    } else {
      adj = value - 0.5;
    }

    // Skip the middle
    if (adj < 0)
      adj -= 0.3;
    else
      adj += 0.3;

    adj /= 1.3;

    return adj;
  }

  function setTime(h, m, s, ms) {
    h %= 12;

    const hourIndex = Math.ceil((h / 12) * hours.length);
    const minuteIndex = Math.ceil((m / 60) * minutes.length);
    const secondIndex = Math.ceil((s / 60) * seconds.length);

    console.log(`${h}:${m}:${s} => ${hourIndex}:${minuteIndex}:${secondIndex}`);

    // Reset
    reset(hourIndex, minuteIndex, secondIndex);

    setHour(hourIndex, getX(hours, hourIndex, m / 60 + s / 3600) * 12);
    setMinute(minuteIndex,
              getX(minutes, minuteIndex, s / 60 + (ms / 60000)) * 9.25);
    setSecond(secondIndex, getX(seconds, secondIndex, ms / 1000) * 8.26);
  }

  const update = () => {
    const now = new Date();
    setTime(now.getHours(), now.getMinutes(), now.getSeconds(),
            now.getMilliseconds());
  };

  setInterval(update, 100);
  update();
})();
