export enum AlgorithmType {
  DIJKSTRAS,
  A_STAR,
  NONE,
}

export default class Algorithm {
  private type: AlgorithmType;

  constructor(type: AlgorithmType) {
    this.type = type;
  }

  public performStep = () => {
    console.log('Performing step of ' + this.type);
  };

  public startNewAlogrithm = (type: AlgorithmType) => {
    this.type = type;
  };

  public getAlgorithmType = (): AlgorithmType => {
    return this.type;
  };
}

export const currentAlgorithm = new Algorithm(AlgorithmType.NONE);
