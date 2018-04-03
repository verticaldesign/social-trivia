import { expect } from 'code'
import React from 'react'
import * as utils from './utils' 

const toFilter = [
    'admin',
    'team-1',
    'team-2',
    'team-3'
];

const toRemove = [
    'admin',
    'team-2'
];

describe('`utils`', () => {

    it('should contain a function that accepts two arrays and filters all the items in the second from the first', () => {

        const expected = [ 'team-1', 'team-3'];

        expect(utils.filterMatchesFromArray(toFilter, toRemove)).to.equal(expected);

    })

})