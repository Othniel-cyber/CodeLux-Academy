const SUPABASE_URL = 'https://votre-projet.supabase.co';
const SUPABASE_ANON_KEY = 'votre-cle-anon';

let supabaseClient = null;
try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn('Supabase SDK non chargé, mode hors-ligne uniquement');
        supabaseClient = {
            from: () => ({
                select: () => Promise.resolve({ data: null, error: new Error('offline') }),
                insert: () => Promise.resolve({ data: null, error: new Error('offline') }),
                upsert: () => Promise.resolve({ data: null, error: new Error('offline') }),
                update: () => Promise.resolve({ data: null, error: new Error('offline') }),
                delete: () => Promise.resolve({ data: null, error: new Error('offline') }),
                eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('offline') }) }),
                order: () => Promise.resolve({ data: null, error: new Error('offline') })
            })
        };
    }
} catch (e) {
    console.warn('Erreur init Supabase, mode hors-ligne');
    supabaseClient = {
        from: () => ({
            select: () => Promise.resolve({ data: null, error: new Error('offline') }),
            insert: () => Promise.resolve({ data: null, error: new Error('offline') }),
            upsert: () => Promise.resolve({ data: null, error: new Error('offline') }),
            update: () => Promise.resolve({ data: null, error: new Error('offline') }),
            delete: () => Promise.resolve({ data: null, error: new Error('offline') }),
            eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('offline') }) }),
            order: () => Promise.resolve({ data: null, error: new Error('offline') })
        })
    };
}
