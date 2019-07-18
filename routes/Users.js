import { Get, Prefix } from '../rest';
import { ErrorUnauthorised } from '../rest/errors';

@Prefix('users')
class Users {
  @Get('list')
  list() {
    throw new ErrorUnauthorised();
    // return [
    //   {
    //     name: 'Flavio',
    //   },
    // ];
  }
}


export default Users;
