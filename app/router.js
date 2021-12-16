import EmberRouter from '@ember/routing/router';
import config from 'turtle-census/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '' });
  this.route('class-composition');
  this.route('guild-members');
  this.route('race-composition');
  this.route('level-composition');
  this.route('faction-balance');
});
