#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
pub mod weights;
pub use weights::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;
    use frame_support::sp_runtime::traits::Saturating;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type WeightInfo: WeightInfo;
        type Currency: frame_support::traits::Currency<Self::AccountId>;
    }

    pub type BalanceOf<T> = <<T as Config>::Currency as frame_support::traits::Currency<<T as frame_system::Config>::AccountId>>::Balance;

    #[pallet::storage]
    pub type EnergyTokenBalance<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, BalanceOf<T>, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        TokensMinted { account: T::AccountId, amount: BalanceOf<T> },
        TokensBurned { account: T::AccountId, amount: BalanceOf<T> },
        TokensTransferred { from: T::AccountId, to: T::AccountId, amount: BalanceOf<T> },
    }

    #[pallet::error]
    pub enum Error<T> {
        InsufficientBalance,
        TransferToSelf,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn mint_tokens(origin: OriginFor<T>, amount: BalanceOf<T>) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            let current_balance = EnergyTokenBalance::<T>::get(&who);
            let new_balance = current_balance.saturating_add(amount);
            
            EnergyTokenBalance::<T>::insert(&who, new_balance);
            
            Self::deposit_event(Event::TokensMinted { account: who, amount });
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn burn_tokens(origin: OriginFor<T>, amount: BalanceOf<T>) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            let current_balance = EnergyTokenBalance::<T>::get(&who);
            ensure!(current_balance >= amount, Error::<T>::InsufficientBalance);
            
            let new_balance = current_balance.saturating_sub(amount);
            EnergyTokenBalance::<T>::insert(&who, new_balance);
            
            Self::deposit_event(Event::TokensBurned { account: who, amount });
            Ok(())
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn transfer_tokens(origin: OriginFor<T>, to: T::AccountId, amount: BalanceOf<T>) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            ensure!(sender != to, Error::<T>::TransferToSelf);
            
            let sender_balance = EnergyTokenBalance::<T>::get(&sender);
            let receiver_balance = EnergyTokenBalance::<T>::get(&to);
            
            ensure!(sender_balance >= amount, Error::<T>::InsufficientBalance);
            
            let new_sender_balance = sender_balance.saturating_sub(amount);
            let new_receiver_balance = receiver_balance.saturating_add(amount);
            
            EnergyTokenBalance::<T>::insert(&sender, new_sender_balance);
            EnergyTokenBalance::<T>::insert(&to, new_receiver_balance);
            
            Self::deposit_event(Event::TokensTransferred { from: sender, to, amount });
            Ok(())
        }
    }
}

