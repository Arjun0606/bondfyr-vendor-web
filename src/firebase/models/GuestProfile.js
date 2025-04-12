import { doc, collection, addDoc, updateDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export class GuestProfile {
  static collectionName = 'guests';
  
  static async create(guestData) {
    const {
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      instagramHandle,
      isFirstTime = true,
      visitCount = 1,
      referralSource,
    } = guestData;

    // Validate required fields
    if (!fullName || !phoneNumber || !email) {
      throw new Error('Missing required fields');
    }

    const guestRef = await addDoc(collection(db, this.collectionName), {
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      instagramHandle,
      isFirstTime,
      visitCount,
      referralSource,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return guestRef.id;
  }

  static async update(guestId, updateData) {
    const guestRef = doc(db, this.collectionName, guestId);
    await updateDoc(guestRef, {
      ...updateData,
      updatedAt: new Date(),
    });
  }

  static async getById(guestId) {
    const guestRef = doc(db, this.collectionName, guestId);
    const guestSnap = await getDoc(guestRef);
    return guestSnap.exists() ? { id: guestSnap.id, ...guestSnap.data() } : null;
  }

  static async findByPhone(phoneNumber) {
    const q = query(
      collection(db, this.collectionName),
      where("phoneNumber", "==", phoneNumber)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  }

  static async incrementVisitCount(guestId) {
    const guestRef = doc(db, this.collectionName, guestId);
    const guestSnap = await getDoc(guestRef);
    if (guestSnap.exists()) {
      const currentCount = guestSnap.data().visitCount || 0;
      await updateDoc(guestRef, {
        visitCount: currentCount + 1,
        isFirstTime: false,
        updatedAt: new Date(),
      });
    }
  }
} 