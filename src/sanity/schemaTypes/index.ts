import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import event from './event'
import teamMember from './teamMember'
import project from './project'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, event, teamMember, project, siteSettings],
}
