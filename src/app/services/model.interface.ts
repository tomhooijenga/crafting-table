export type ModelConstructor = new(id?: number) => ModelInterface;

export interface ModelInterface {
  id?: number;
}
