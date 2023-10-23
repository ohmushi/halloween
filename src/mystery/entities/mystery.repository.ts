import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/Option';
import { Mystery } from './mystery.entity';
export interface MysteryRepository {
  nextId(): string;

  alreadyKnowTheCode(code: string): boolean;
  add(mystery: Mystery): Either<Error, Mystery>;
  all(): Mystery[];
  byId(id: string): Option<Mystery>;

  byCode(code: string): Option<Mystery>;
}
