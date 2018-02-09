'use strict';

const photo = require('../../model/photo');
const superagent = require('superagent');
const server = require('../../lib/server');
const mocks = require('../lib/mocks');
const gallery = require('../../model/gallery');
const faker = require('faker');
const image = `${__dirname}/../lib/pic.jpg`;
require ('jest');


beforeAll(() => server.start());
afterAll(() => server.stop());
afterAll(mocks.auth.removeAll);
afterAll(mocks.gallery.removeAll);

describe('Photo Model test', function() {

  it('should return a valid 201 code on a post', () => {
    let galleryMock = null;
    return mocks.gallery.createOne()
      .then(mock => {
        galleryMock = mock;
        return superagent.post(`:${process.env.PORT}/api/v1/photo`)
          .set('Authorization', `Bearer ${galleryMock.token}`)
          .field('name', faker.image.cats())
          .field('desc', faker.lorem.words())
          .field('galleryId', `${galleryMock.gallery._id}`)
          .attach('image', image);
      })
      .then( res => {
        expect(res.status).toEqual(201);
      });
  });
  it('should return a 401 not authorized give a bad token', () => {
    return superagent.post(`:${process.env.PORT}/api/v1/photo`)
      .set('Authorization', 'Bearer badtoken')
      .catch( err => expect(err.status).toEqual(401));
  });


});

