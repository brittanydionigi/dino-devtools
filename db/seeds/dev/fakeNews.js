exports.seed = function(knex, Promise) {
  return knex('fake_news').del()
    .then(function () {
      return knex('fake_news').insert([
        { headline: 'Penguins defeat Senators in 2OT of Game 7, return to Cup Final', byline: 'Wes Crosby / NHL.com Correspondent', summary: 'Chris Kunitz scores at 5:09 to give Pittsburgh chance to repeat as champion', content: 'PITTSBURGH -- It had been a while since Chris Kunitz showed how valuable he\'s been throughout his time with the Pittsburgh Penguins. On Thursday, Kunitz did his part to send Pittsburgh back to the Stanley Cup Final. The left wing scored 5:09 into the second overtime to give the Penguins a 3-2 win against the Ottawa Senators in Game 7 of the Eastern Conference Final at PPG Paints Arena.' },
        { headline: 'Penguins will play Predators in Stanley Cup Final', byline: 'Mike Battaglino / NHL.com Staff Writer', summary: 'Defending champion Pittsburgh has home-ice advantage, will host Game 1 on Monday', content: 'The Pittsburgh Penguins will play the Nashville Predators in the 2017 Stanley Cup Final. Game 1 is at Pittsburgh on Monday (8 p.m. ET; NBC, CBC, SN, TVA Sports). The Penguins, the defending Stanley Cup champions, advanced with a 3-2, double-overtime win against the Ottawa Senators in Game 7 of the Eastern Conference Final on Thursday. Pittsburgh can become the first repeat champion since the Detroit Red Wings in 1997-98.' },
        { headline: 'Playoff Buzz: What we learned Thursday', byline: 'NHL.com', summary: 'Penguins headed to Stanley Cup Final after double-OT win against Senators in Game 7', content: 'Welcome to the 2017 Stanley Cup Playoff Buzz, your daily look at the stories impacting the 2016-17 postseason. The Pittsburgh Penguins are going to the Stanley Cup Final for the second straight season after a double-overtime win against the Ottawa Senators in Game 7 of the Eastern Conference Final. Game 1 of the Stanley Cup Final is Monday in Pittsburgh. Here is the playoff news for Friday: ' }
      ]);
    });
};