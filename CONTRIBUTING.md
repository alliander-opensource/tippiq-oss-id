Contributing
============

## Style guide and coding conventions
Below is a list of style and coding conventions.

### Imports
Split imports into two lists; one for imports from other packages and one
for imports from local packages. Import local files absolute from the
root of the src folder. Always import files from the index file when
available. For example don't do:

    import { Logo } from '../../components';
    import Logo from '../../components/Logo';

But do

    import { Logo } from 'components';
