'use server';

import connectToDatabase from '@/lib/mongodb';
import { Camp } from '@/models/Camp';
import { Resource } from '@/models/Resource';
import { Volunteer } from '@/models/Volunteer';
import { Donation } from '@/models/Donation';
import { IncidentReport } from '@/models/IncidentReport';

/**
 * Fetch all essential initial state to hydrate the Zustand store on load.
 * We return plain objects for Zustand.
 */
export async function fetchInitialState() {
  try {
    await connectToDatabase();
    
    const [camps, resources, volunteers, donations, incidentReports] = await Promise.all([
      Camp.find({}).lean(),
      Resource.find({}).lean(),
      Volunteer.find({}).lean(),
      Donation.find({}).lean(),
      IncidentReport.find({}).lean(),
    ]);

    // Format plain objects securely by removing strict MongoDB properties like _id and __v
    const serializeDocs = (docs: any[]) => docs.map((doc) => {
      const { _id, __v, ...rest } = doc;
      return rest;
    });

    return {
      success: true,
      data: {
        camps: serializeDocs(camps),
        resources: serializeDocs(resources),
        volunteers: serializeDocs(volunteers),
        donations: serializeDocs(donations),
        incidentReports: serializeDocs(incidentReports)
      }
    };
  } catch (error) {
    console.error("Failed to fetch initial state:", error);
    return { success: false, error: "Failed to connect to database" };
  }
}
