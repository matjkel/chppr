
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(), 

    // Inserts seed entries
    knex('users').insert({
        username: 'Rico',
        password: 'ricoR',
        name: 'Rico Rojas',
        profilepic: 'https://avatars3.githubusercontent.com/u/14986071'
    }),
    knex('users').insert({
        username: 'Nathan',
        password: 'nathanS',
        name: 'Nathan Schwartz',
        profilepic: 'https://avatars2.githubusercontent.com/u/16125598'
    }),
    knex('users').insert({
        username: 'John',
        password: 'johnC',
        name: 'John Carpenter',
        profilepic: 'https://avatars0.githubusercontent.com/u/2602674'
    }),
    knex('users').insert({
        username: 'Ion',
        password: 'ionG',
        name: 'Ion Gorincioi',
        profilepic: 'https://avatars0.githubusercontent.com/u/14967432'
    }),
    knex('users').insert({
        username: 'Matt',
        password: 'mattK',
        name: 'Matt J Kelly',
        profilepic: 'https://avatars1.githubusercontent.com/u/7296584'
    })
  );
};
