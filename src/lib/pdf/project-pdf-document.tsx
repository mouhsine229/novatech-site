import { Document, Page, Text, View, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { Project, ProjectScreenshot } from "@/lib/types";

const NAVY = "#0B0E14";
const SIGNAL = "#E8542C";
const SLATE = "#6B7280";
const BORDER = "#E5E2D8";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    color: NAVY,
    fontFamily: "Helvetica",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    paddingBottom: 14,
    borderBottom: `2px solid ${SIGNAL}`,
  },
  brand: {
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 1,
  },
  brandTag: {
    fontSize: 8,
    color: SLATE,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statusBadge: {
    fontSize: 9,
    color: "#FFFFFF",
    backgroundColor: SIGNAL,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: SLATE,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    marginBottom: 20,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 9,
    color: SIGNAL,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: NAVY,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  col: {
    flex: 1,
  },
  techPill: {
    fontSize: 9,
    color: NAVY,
    border: `1px solid ${BORDER}`,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    paddingTop: 10,
    borderTop: `1px solid ${BORDER}`,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: SLATE,
  },
});

export function ProjectPdfDocument({
  project,
  screenshots,
}: {
  project: Project;
  screenshots: ProjectScreenshot[];
}) {
  const coverImage = screenshots.find((s) => s.type === "desktop")?.url_image ?? project.image_principale;

  return (
    <Document
      title={`${project.nom} — NOVATECH`}
      author="NOVATECH"
      subject={`Fiche projet : ${project.nom}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.brand}>NOVATECH</Text>
            <Text style={styles.brandTag}>Développement Web · IA · Automatisation</Text>
          </View>
          {project.statut === "termine" && <Text style={styles.statusBadge}>PROJET LIVRÉ</Text>}
        </View>

        <Text style={styles.title}>{project.nom}</Text>
        {project.date_fin && (
          <Text style={styles.subtitle}>
            Livré le{" "}
            {new Date(project.date_fin).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        )}

        {coverImage && <Image src={coverImage} style={styles.image} />}

        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.paragraph}>{project.description}</Text>

        <View style={styles.row}>
          {project.technologies?.length > 0 && (
            <View style={styles.col}>
              <Text style={styles.sectionLabel}>Technologies</Text>
              <View style={styles.techRow}>
                {project.technologies.map((tech) => (
                  <Text key={tech} style={styles.techPill}>
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          )}
          {project.client && (
            <View style={styles.col}>
              <Text style={styles.sectionLabel}>Client</Text>
              <Text style={styles.paragraph}>{project.client}</Text>
            </View>
          )}
        </View>

        {project.url_projet && (
          <View>
            <Text style={styles.sectionLabel}>Voir le projet en ligne</Text>
            <Link src={project.url_projet} style={{ fontSize: 11, color: SIGNAL }}>
              {project.url_projet}
            </Link>
          </View>
        )}

        <View style={styles.footer}>
          <Text>NOVATECH — novatech.com</Text>
          <Text>Document généré automatiquement</Text>
        </View>
      </Page>
    </Document>
  );
}
