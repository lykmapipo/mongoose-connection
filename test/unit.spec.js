import { sinon, expect } from '@lykmapipo/test-helpers';
import mongoose from 'mongoose';

import {
  enableDebug,
  disableDebug,
  isConnection,
  isConnected,
} from '../src/index';

describe('unit', () => {
  it('should enable mongoose degugging', () => {
    const set = sinon.spy(mongoose, 'set');

    enableDebug();

    expect(set).to.have.been.calledOnce;
    expect(set).to.have.been.calledWith('debug', true);

    set.restore();
  });

  it('should enable mongoose degugging', () => {
    const set = sinon.spy(mongoose, 'set');

    disableDebug();

    expect(set).to.have.been.calledOnce;
    expect(set).to.have.been.calledWith('debug', false);

    set.restore();
  });

  it('should check if value is a Connection', () => {
    expect(isConnection).to.exist;
    expect(isConnection).to.be.a('function');
    expect(isConnection).to.have.length(1);

    const val = '12345';
    expect(isConnection(val)).to.be.false;
  });

  it('should check if connected', () => {
    expect(isConnected()).to.be.false;
    expect(isConnected('connection')).to.be.false;
  });
});
