import { GameBoard2D } from './GameBoard2D';
import SupabaseGameBoard from './containers/SupabaseGameBoard';

// Export the regular component for development/testing
export { GameBoard2D };

// Export the Supabase-integrated version as the default
export default SupabaseGameBoard;
