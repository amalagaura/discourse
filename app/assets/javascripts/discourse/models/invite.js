/**
  A data model representing an Invite

  @class Invite
  @extends Discourse.Model
  @namespace Discourse
  @module Discourse
**/

Discourse.Invite = Discourse.Model.extend({

  rescind: function() {
    Discourse.ajax('/invites', {
      type: 'DELETE',
      data: { email: this.get('email') }
    });
    this.set('rescinded', true);
  }

});

Discourse.Invite.reopenClass({

  create: function() {
    var result = this._super.apply(this, arguments);
    if (result.user) {
      result.user = Discourse.User.create(result.user);
    }
    return result;
  },

  findInvitedBy: function(user, filter, offset) {
    if (!user) { return Em.RSVP.resolve(); }

    var data = {};
    if (!Em.isNone(filter)) { data.filter = filter; }
    data.offset = offset || 0;

    return Discourse.ajax("/users/" + user.get('username_lower') + "/invited.json", {data: data}).then(function (result) {
      result.invites = result.invites.map(function (i) {
        return Discourse.Invite.create(i);
      });

      return Em.Object.create(result);
    });
  }

});


